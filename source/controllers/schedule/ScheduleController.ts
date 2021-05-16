import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { ScheduleTable } from '../../entities/ScheduleTable';
import { Station } from '../../entities/Station';
import { dailySchedule } from '../../../typeDefs/types';
import { Employee } from '../../entities/Employee';

export class ScheduleController {
	static getScheduleByDate = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const date = req.query.date;
			if (typeof date === 'string') {
				const response = await getRepository(ScheduleTable).find({
					relations: ['station', ...returnEmployeeCellNames()],
					where: { date: date },
				});

				const completeDailySchedule: dailySchedule = { [date]: {} };

				// if there are no schedule for given data controller should send back null arrays for each station
				if (!response.length) {
					req.body.stations.forEach((station: Station) => {
						completeDailySchedule[date][station.name] = new Array(
							station.numberOfCellsInTable
						).fill(null);
					});
				} else {
					response.forEach((schedule: { [employeeCell: string]: any }) => {
						const stationName = schedule.station.name;
						const employeesOnStation: Employee[] = [];

						for (const employeeCell in schedule) {
							if (
								Object.prototype.hasOwnProperty.call(schedule, employeeCell)
							) {
								if (!['date', 'station', 'id'].includes(employeeCell)) {
									const employee = schedule[employeeCell];
									employeesOnStation.push(employee);
								}
							}
						}

						const maxNumberOfCellsPerStation: number =
							schedule.station.numberOfCellsInTable;
						employeesOnStation.splice(maxNumberOfCellsPerStation);

						completeDailySchedule[date][stationName] = employeesOnStation;
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
		const scheduleRepository = getRepository(ScheduleTable);
		const schedulesToSave: ScheduleTable[] = [];

		for (const stationName in req.body.schedules) {
			if (
				Object.prototype.hasOwnProperty.call(req.body.schedules, stationName)
			) {
				const stationEntity: Station = req.body.stations.find(
					(stat: Station) => stat.name === stationName
				);
				const stationTable = req.body.schedules[stationName];
				const employeeCells: { [cell: string]: Employee | null } = {};

				returnEmployeeCellNames().forEach((cellName: string, index: number) => {
					if (index >= stationEntity.numberOfCellsInTable) return;
					const employee: Employee | null =
						req.body.employees.find(
							(emp: Employee) => emp.id === stationTable[index]?.id
						) || null;
					employeeCells[cellName] = employee;
				});

				const newSchedule = scheduleRepository.create({
					date: req.body.date,
					station: stationEntity,
					...employeeCells,
				});
				schedulesToSave.push(newSchedule);
			}
		}
		const response = await scheduleRepository.save(schedulesToSave);
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

		const scheduleRepository = getRepository(ScheduleTable);
		const currentSchedulesPerDate = await scheduleRepository.find({
			relations: ['station', ...returnEmployeeCellNames()],
			where: { date },
		});

		if (currentSchedulesPerDate.length)
			return res
				.status(400)
				.send('There is a schedule in the database for a given date.');

		req.body.currentSchedulesPerDate = currentSchedulesPerDate;
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

function returnEmployeeCellNames(): string[] {
	return [
		'cell1Employee',
		'cell2Employee',
		'cell3Employee',
		'cell4Employee',
		'cell5Employee',
		'cell6Employee',
		'cell7Employee',
		'cell8Employee',
		'cell9Employee',
		'cell10Employee',
		'cell11Employee',
		'cell12Employee',
	];
}

function validateDateString(date: string): boolean {
	return /^\d{4}[-](0?[1-9]|1[012])[-](0?[1-9]|[12][0-9]|3[01])$/.test(date);
}
