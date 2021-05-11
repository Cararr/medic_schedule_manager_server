/* import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { WorkStageSpan } from '../../entities/WorkStageSpan';
import { ScheduleCell } from '../../entities/ScheduleTable';

export class ScheduleController {
	static getScheduleByDate = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const date = req.query.date;

			const cells = await getRepository(ScheduleCell).find({
				where: { date: date },
			});
			res.json(cells);
		} catch (error) {
			next(error);
		}
	};
} */
