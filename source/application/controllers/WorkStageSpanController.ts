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
			console.log(req.cookies);

			const stageSpans = await getRepository(WorkStageSpan).find();
			res.json(stageSpans);
		} catch (error) {
			next(error);
		}
	};
}
