import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { WorkStageSpan } from '../../domain/entities/WorkStageSpan';

export class WorkStageSpanController {
	static getAllWorkStageSpans = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const workStageSpans = await getRepository(WorkStageSpan).find();
			res.send({ workStageSpans });
		} catch (error) {
			next(error);
		}
	};
}
