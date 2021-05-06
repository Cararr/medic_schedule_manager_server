import { Request, Response, NextFunction } from 'express';
import { pool } from '../../../configs/pgconfig';
import { returnQueryCellsByStationName } from '../../../util/utilities';
import {
	dbSearchIdListResults,
	fullDailySchedule,
	employee,
} from '../../../typeDefs/types';
import { loadEmployees } from '../../resources/employeesList';

let employees: employee[];
loadEmployees.then((response) => {
	employees = response;
});

export const getSchedulesByDate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.query.date) {
		next(new Error('missing query.data'));
		return;
	}
	try {
		const date: string = req.query.date.toString();
		const kinezaSearchResults = await pool.query(
			`SELECT ${returnQueryCellsByStationName(
				'kineza'
			)} FROM KINEZA WHERE schedule_date = $1;`,
			[date]
		);
		const fizykoSearchResults = await pool.query(
			`SELECT ${returnQueryCellsByStationName(
				'fizyko'
			)} FROM FIZYKO WHERE schedule_date = $1;`,
			[date]
		);
		const masazSearchResults = await pool.query(
			`SELECT ${returnQueryCellsByStationName(
				'masaz'
			)} FROM MASAZ WHERE schedule_date = $1;`,
			[date]
		);
		const kinezaSchedule = replaceIdsWithEmployees(
			convertResponseObjectToArrayOfIds(kinezaSearchResults.rows[0])
		);
		const fizykoSchedule = replaceIdsWithEmployees(
			convertResponseObjectToArrayOfIds(fizykoSearchResults.rows[0])
		);
		const masazSchedule = replaceIdsWithEmployees(
			convertResponseObjectToArrayOfIds(masazSearchResults.rows[0])
		);
		const fullDailyScheudle: fullDailySchedule = {
			[date]: {
				KINEZA: kinezaSchedule,
				FIZYKO: fizykoSchedule,
				MASAZ: masazSchedule,
			},
		};
		res.send(fullDailyScheudle);
	} catch (error) {
		next(error);
	}
};

export const getSchedulesByStationAndDate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.query.date) {
			next(new Error('missing query.data'));
			return;
		}
		const stationType = req.path.slice(1);
		const queryCells: string = returnQueryCellsByStationName(stationType);
		const date: string = req.query.date.toString();
		const dbResponse = await pool.query(
			`SELECT ${queryCells} FROM ${stationType} WHERE schedule_date = $1;`,
			[date]
		);
		const searchResults: dbSearchIdListResults = dbResponse.rows[0];

		const schedule = convertResponseObjectToArrayOfIds(searchResults);

		const namesSchedule: string[] = replaceIdsWithEmployees(schedule);
		res.send(namesSchedule);
	} catch (error) {
		next(error);
	}
};

function convertResponseObjectToArrayOfIds(
	dbResponse: dbSearchIdListResults
): (number | null)[] {
	const schedule: (number | null)[] = [];
	for (const key in dbResponse) {
		if (dbResponse.hasOwnProperty(key)) {
			const element: number | null = dbResponse[key];
			schedule.push(element);
		}
	}
	return schedule;
}
function replaceIdsWithEmployees(idsList: (number | null)[]): string[] {
	return idsList.map((id) => {
		const employee = employees.find((employee) => employee.id === id);
		return employee ? `${employee.name} ${employee.last_name}` : '';
	});
}
