import { Request, Response, NextFunction } from 'express';
import { logger } from '../infrastructure/logger';
export const loggerHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	logger.error(err);
	console.error(err.message);
	res.status(500).send(err.message);
};
