import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { ScheduleCell } from '../../domain/entities/ScheduleCell';
import { Station } from '../../domain/entities/Station';
import { Employee } from '../../domain/entities/Employee';
import { dailySchedule } from '../../../typeDefs/types';

export class ScheduleController {
	static getScheduleByDate = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const date = req.query.date;
			if (typeof date === 'string' && validateDateString(date)) {
				const response = await getRepository(ScheduleCell).find({
					relations: ['station', 'cellValue'],
					where: { date },
				});

				const completeDailySchedule: dailySchedule = { [date]: {} };

				// if there are no schedule for given data controller should send back null arrays for each station

				req.body.stations.forEach((station: Station) => {
					completeDailySchedule[date][station.name] = new Array(
						station.numberOfCellsInTable
					).fill(null);
				});

				if (response.length) {
					response.forEach((tableCell: ScheduleCell) => {
						const stationName = tableCell.station.name;
						const employeeInCell = tableCell.cellValue;
						const indexOfCell = tableCell.orderInTable;
						completeDailySchedule[date][stationName][indexOfCell] =
							employeeInCell;
					});
				}
				res.send(completeDailySchedule);
			} else next(new Error('invalid date'));
		} catch (error) {
			next(error);
		}
	};

	static saveSchedule = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
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
						cellValue: reqCell,
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

	static reqBodyVeryfier = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		// Still need to check if arrays contains Employee or nulls...
		const date = Object.keys(req.body)[0];
		if (!validateDateString(date)) return res.status(400).send('Invalid date.');

		const scheduleCellsRepository = getRepository(ScheduleCell);
		const currentCellsPerDate = await scheduleCellsRepository.find({
			relations: ['station', 'cellValue'],
			where: { date },
		});

		req.body.currentCellsPerDate = currentCellsPerDate;
		req.body.date = date;
		req.body.schedules = req.body[date];

		for (const stationName of Object.keys(req.body.schedules)) {
			const station = req.body.stations.find(
				(station: Station) => station.name === stationName
			);
			if (!station) return res.status(400).send('Wrong staiton names.');
			const stationSchedule: (Employee | null)[] =
				req.body.schedules[stationName];
			if (stationSchedule.length !== station.numberOfCellsInTable)
				return res.status(400).send('Wrong arrays format.');
		}
		next();
	};
}

function validateDateString(date: string): boolean {
	return /^\d{4}[-](0?[1-9]|1[012])[-](0?[1-9]|[12][0-9]|3[01])$/.test(date);
}
