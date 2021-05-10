import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { WorkStageSpan } from '../../entities/WorkStageSpan';

export class WorkStageSpanController {
	static getAllWorkStageSpans = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const stageSpans = await getRepository(WorkStageSpan).find();
			res.json(stageSpans);
		} catch (error) {
			next(error);
		}
	};
}