import express, { Request, Response, NextFunction } from 'express';
import { pool } from '../../../pgconfig';
import { dbSearchResults } from '../../../types/types';
import { test } from '../employees/employees';
export const schedulesRouter = express.Router();

schedulesRouter.get(
	'/kineza',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			console.log(test);

			const date: string = req.body.date;
			const dbResponse = await pool.query(
				'SELECT CELL_1, CELL_2, CELL_3, CELL_4, CELL_5, CELL_6, CELL_7, CELL_8, CELL_9, CELL_10 FROM KINEZA JOIN SCHEDULES ON SCHEDULES.ID = KINEZA.SCHEDULE_ID WHERE date = $1;',
				[date]
			);
			const results: dbSearchResults = dbResponse.rows[0];
			const schedule: number[] = [];
			for (const key in results) {
				if (results.hasOwnProperty(key)) {
					const element: number = results[key];
					schedule.push(element);
				}
			}
			res.send(schedule);
		} catch (error) {
			console.error(error);
		}
	}
);

schedulesRouter.get(
	'/fizyko',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const date: string = req.body.date;
			const dbResponse = await pool.query(
				'SELECT CELL_1, CELL_2, CELL_3, CELL_4, CELL_5, CELL_6, CELL_7, CELL_8 FROM FIZYKO JOIN SCHEDULES ON SCHEDULES.ID = FIZYKO.SCHEDULE_ID WHERE date = $1;',
				[date]
			);
			const results: dbSearchResults = dbResponse.rows[0];
			const schedule: number[] = [];
			for (const key in results) {
				if (results.hasOwnProperty(key)) {
					const element: number = results[key];
					schedule.push(element);
				}
			}
			res.send(schedule);
		} catch (error) {
			console.error(error);
		}
	}
);

schedulesRouter.get(
	'/masaz',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const date: string = req.body.date;
			const dbResponse = await pool.query(
				'SELECT CELL_1, CELL_2, CELL_3, CELL_4 FROM MASAZ JOIN SCHEDULES ON SCHEDULES.ID = MASAZ.SCHEDULE_ID WHERE date = $1;',
				[date]
			);
			const results: dbSearchResults = dbResponse.rows[0];
			const schedule: number[] = [];
			for (const key in results) {
				if (results.hasOwnProperty(key)) {
					const element: number = results[key];
					schedule.push(element);
				}
			}
			res.send(schedule);
		} catch (error) {
			console.error(error);
		}
	}
);
