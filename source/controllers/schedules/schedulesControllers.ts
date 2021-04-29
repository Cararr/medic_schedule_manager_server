import { Request, Response, NextFunction } from 'express';
import { pool } from '../../../configs/pgconfig';
import {
	dbSearchIdListResults,
	fullDailySchedule,
	employee,
} from '../../../typesDefs/types';
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
			`SELECT CELL_1, CELL_2, CELL_3, CELL_4, CELL_5, CELL_6, CELL_7, CELL_8, CELL_9, CELL_10 FROM KINEZA JOIN SCHEDULES ON SCHEDULES.ID = KINEZA.SCHEDULE_ID WHERE date = $1;`,
			[date]
		);
		const fizykoSearchResults = await pool.query(
			`SELECT CELL_1, CELL_2, CELL_3, CELL_4, CELL_5, CELL_6, CELL_7, CELL_8 FROM FIZYKO JOIN SCHEDULES ON SCHEDULES.ID = FIZYKO.SCHEDULE_ID WHERE date = $1;`,
			[date]
		);
		const masazSearchResults = await pool.query(
			`SELECT CELL_1, CELL_2, CELL_3, CELL_4 FROM MASAZ JOIN SCHEDULES ON SCHEDULES.ID = MASAZ.SCHEDULE_ID WHERE date = $1;`,
			[date]
		);
		const kinezaSchedule = replaceIdsWithEmployees(
			convertResonseObjectToArrayOfIds(kinezaSearchResults.rows[0])
		);
		const fizykoSchedule = replaceIdsWithEmployees(
			convertResonseObjectToArrayOfIds(fizykoSearchResults.rows[0])
		);
		const masazSchedule = replaceIdsWithEmployees(
			convertResonseObjectToArrayOfIds(masazSearchResults.rows[0])
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
			`SELECT ${queryCells} FROM ${stationType} JOIN SCHEDULES ON SCHEDULES.ID = ${stationType}.SCHEDULE_ID WHERE date = $1;`,
			[date]
		);
		const searchResults: dbSearchIdListResults = dbResponse.rows[0];

		const schedule = convertResonseObjectToArrayOfIds(searchResults);

		const namesSchedule: string[] = replaceIdsWithEmployees(schedule);
		res.send(namesSchedule);
	} catch (error) {
		next(error);
	}
};

function convertResonseObjectToArrayOfIds(
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

function returnQueryCellsByStationName(station: string): string {
	switch (station) {
		case 'kineza':
			return 'CELL_1, CELL_2, CELL_3, CELL_4, CELL_5, CELL_6, CELL_7, CELL_8, CELL_9, CELL_10';
		case 'fizyko':
			return 'CELL_1, CELL_2, CELL_3, CELL_4, CELL_5, CELL_6, CELL_7, CELL_8';
		case 'masaz':
			return 'CELL_1, CELL_2, CELL_3, CELL_4';
		default:
			return '';
	}
}
