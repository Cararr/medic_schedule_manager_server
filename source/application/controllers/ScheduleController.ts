import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { ScheduleCell } from '../../domain/entities/ScheduleCell';
import { Station } from '../../domain/entities/Station';
import { Employee } from '../../domain/entities/Employee';
import { scheduleGenerator } from '../../domain/scheduleGenerator/scheduleGenerator';
import { validateDateFormat } from '../../../util/utilities';
import { dailyDateSchedule, employeeRole } from '../../../typeDefs/types';

export class ScheduleController {
	static getScheduleByDate = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const date = req.query.date;
			if (typeof date !== 'string' || !validateDateFormat(date))
				return res.status(400).send({ message: 'Wrong date format.' });

			const response = await getRepository(ScheduleCell).find({
				relations: ['station', 'employeeAtCell'],
				where: { date },
			});

			const completeDailySchedule: dailyDateSchedule = { [date]: {} };

			// if there are no schedule for given data controller should send back null arrays for each station

			req.body.stations.forEach((station: Station) => {
				completeDailySchedule[date][station.name] = new Array(
					station.numberOfCellsInTable
				).fill(null);
			});

			if (response.length) {
				response.forEach((tableCell: ScheduleCell) => {
					const stationName = tableCell.station.name;
					const employeeInCell = tableCell.employeeAtCell;
					const indexOfCell = tableCell.orderInTable;
					completeDailySchedule[date][stationName][indexOfCell] =
						employeeInCell;
				});
			}
			res.send(completeDailySchedule);
		} catch (error) {
			next(error);
		}
	};

	static saveSchedule = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const userRole = req.body.tokenDecoded.employeeRole;
			if (!isEmployeeBoss(userRole))
				return res.status(403).send({ message: 'Unauthorized.' });

			const scheduleCellsRepository = getRepository(ScheduleCell);
			const cellsToSave: ScheduleCell[] = [];

			for (const stationName in req.body.schedules) {
				if (
					Object.prototype.hasOwnProperty.call(req.body.schedules, stationName)
				) {
					const stationEntity: Station = req.body.stations.find(
						(stat: Station) => stat.name === stationName
					);
					const reqCellsAtStation = req.body.schedules[stationName];
					const currentCellsAtStation = req.body.currentCellsPerDate.filter(
						(cell: ScheduleCell) => cell.station.name === stationName
					);

					for (const [index, reqCell] of reqCellsAtStation.entries()) {
						const newCell = scheduleCellsRepository.create({
							date: req.body.date,
							station: stationEntity,
							employeeAtCell: reqCell,
							orderInTable: index,
						});

						let updatedCell: ScheduleCell;
						if (currentCellsAtStation[index]) {
							newCell.id = currentCellsAtStation[index].id;
							updatedCell = await scheduleCellsRepository.preload(newCell);
						}
						cellsToSave.push(newCell || updatedCell);
					}
				}
			}
			const response = await scheduleCellsRepository.save(cellsToSave);
			res.send(response);
		} catch (error) {
			next(error);
		}
	};

	static generateScheudle = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			res.send(scheduleGenerator(req.body.employees, req.body.stations));
		} catch (error) {
			next(error);
		}
	};
	static loadStationsAndEmployees = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const stations = await getRepository(Station).find();
			const employees = await getRepository(Employee).find();
			req.body.stations = stations;
			req.body.employees = employees;
			next();
		} catch (error) {
			next(error);
		}
	};

	static deleteScheduleByDate = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const userRole = req.body.tokenDecoded.employeeRole;
			if (!isEmployeeBoss(userRole))
				return res.status(403).send({ message: 'Unauthorized.' });

			const date = req.params.date;
			if (typeof date !== 'string' || !validateDateFormat(date))
				return res.status(400).send({ message: 'Wrong date format.' });

			const cellRepo = getRepository(ScheduleCell);
			const cellsAtDate = await cellRepo.find({
				where: { date },
			});
			if (!cellsAtDate.length)
				return res
					.status(400)
					.send({ message: 'Schedules for a given data not found.' });

			await cellRepo.remove(cellsAtDate);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	};

	static saveScheduleReqVeryfier = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const date = req.params.date;
		if (!validateDateFormat(date))
			return res.status(400).send({ message: 'Invalid date.' });
		req.body.date = date;

		const scheduleCellsRepository = getRepository(ScheduleCell);
		const currentCellsPerDate = await scheduleCellsRepository.find({
			relations: ['station', 'employeeAtCell'],
			where: { date },
		});
		req.body.currentCellsPerDate = currentCellsPerDate;

		req.body.schedules = req.body.schedules;
		for (const stationName of Object.keys(req.body.schedules)) {
			const station = req.body.stations.find(
				(station: Station) => station.name === stationName
			);
			if (!station)
				return res.status(400).send({ message: 'Wrong station names.' });

			const cellsAtStaiton: (Employee | null)[] =
				req.body.schedules[stationName];
			for (const cellValue of cellsAtStaiton) {
				if (
					cellValue !== null &&
					!req.body.employees.some((emp: Employee) => emp.id === cellValue.id)
				)
					return res.status(400).send({
						message:
							'Wrong schedules values. Accept null or employee object with valid id',
					});
			}

			if (cellsAtStaiton.length !== station.numberOfCellsInTable)
				return res.status(400).send({ message: 'Wrong arrays length.' });
		}
		next();
	};
}

function isEmployeeBoss(role: employeeRole): boolean {
	return role === employeeRole.BOSS;
}
