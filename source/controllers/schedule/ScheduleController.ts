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
					relations: ['station', ...returnEmployeeRelations()],
					where: { date: date },
				});
				const test = await getRepository(Station).find();
				console.log(test);

				const completeDailySchedule: dailySchedule = { [date]: {} };

				response.forEach((schedule: { [employeeCell: string]: any }) => {
					const stationName = schedule.station.name;
					const employeesOnStation: Employee[] = [];

					for (const employeeCell in schedule) {
						if (Object.prototype.hasOwnProperty.call(schedule, employeeCell)) {
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

				res.send(completeDailySchedule);
			} else next(new Error('invalid date'));
		} catch (error) {
			next(error);
		}
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
