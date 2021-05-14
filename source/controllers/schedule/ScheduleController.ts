import { Request, Response, NextFunction } from 'express';
import { getManager, getRepository } from 'typeorm';
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
					relations: ['station', ...returnEmployeeRelations()],
					where: { date: date },
				});

				const completeDailySchedule: dailySchedule = { [date]: {} };

				// if there are no schedule for given data controller should send back null arrays for each station
				if (!response.length) {
					const stations = await getRepository(Station).find();
					stations.forEach((station) => {
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
		const scheduleRepository = await getRepository(ScheduleTable);
		const test = await scheduleRepository.find({
			relations: ['station', ...returnEmployeeRelations()],
			where: { date: '2021-05-17', station: { id: 2 } },
		});
		const newSchedule = await scheduleRepository.create({
			date: '2021-05-17',
			station: { id: 1 },
			cell1Employee: {
				firstName: 'A',
				lastName: 'S',
				id: 'f2c5c715-02fe-45fb-b621-67d746db26b4',
			},
		});
		const response = await scheduleRepository.save(newSchedule);
		console.log(test);
		res.send(newSchedule);
	};
}

function returnEmployeeRelations(): string[] {
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
