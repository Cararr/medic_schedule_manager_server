import express, { Request, Response, NextFunction } from 'express';
import { pool } from '../../../pgconfig';
import { dbSearchIdListResults, employee } from '../../../types/types';
import { loadEmployees } from '../../resources/employeesList';
export const schedulesRouter = express.Router();

let employees: employee[];
loadEmployees.then((response) => {
	employees = response;
});

schedulesRouter.get(
	['/kineza', '/fizyko', '/masaz'],
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const stationType = req.url.slice(1);
			let queryCells: string;
			switch (stationType) {
				case 'kineza':
					queryCells =
						'CELL_1, CELL_2, CELL_3, CELL_4, CELL_5, CELL_6, CELL_7, CELL_8, CELL_9, CELL_10';
					break;
				case 'fizyko':
					queryCells =
						'CELL_1, CELL_2, CELL_3, CELL_4, CELL_5, CELL_6, CELL_7, CELL_8';
					break;
				case 'masaz':
					queryCells = 'CELL_1, CELL_2, CELL_3, CELL_4';
					break;
				default:
					return '';
			}
			const date: string = req.body.date;
			const dbResponse = await pool.query(
				`SELECT ${queryCells} FROM ${stationType} JOIN SCHEDULES ON SCHEDULES.ID = ${stationType}.SCHEDULE_ID WHERE date = $1;`,
				[date]
			);
			const results: dbSearchIdListResults = dbResponse.rows[0];
			const schedule: number[] = [];
			for (const key in results) {
				if (results.hasOwnProperty(key)) {
					const element: number = results[key];
					schedule.push(element);
				}
			}
			const namesSchedule: string[] = replaceIdsWithEmployees(schedule);
			res.send(namesSchedule);
		} catch (error) {
			console.error(error);
		}
	}
);

function replaceIdsWithEmployees(idsList: (number | null)[]): string[] {
	return idsList.map((id) => {
		const employee = employees.find((employee) => employee.id === id);
		return employee ? employee.last_name : '';
	});
}
