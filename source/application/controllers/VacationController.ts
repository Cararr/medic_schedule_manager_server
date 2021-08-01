import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from 'routing-controllers';
import { getRepository } from 'typeorm';
import { validateDateFormat } from '../../../util/utilities';
import { Vacation } from '../../domain/entities/Vacation';

export class VacationController {
	static getByYear = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const year = req.query.year;
			if (!validateYear(year)) return new BadRequestError('Invalid year.');
			const vacations = await getRepository(Vacation).find();
			res.send({ vacations });
		} catch (error) {
			next(error);
		}
	};

	static create = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const year = req.query.year;
			if (!validateYear(year)) return new BadRequestError('Invalid year.');
			const vacations = await getRepository(Vacation).find();
			res.send({ vacations });
		} catch (error) {
			next(error);
		}
	};

	static verifyPayload = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		if (
			!validateDateFormat(req.body.vacation.from) ||
			!validateDateFormat(req.body.vacation.to)
		)
			return res.status(400).send(new BadRequestError('Invalid date.'));

		console.log(req.body.employees);
		//WALIDUJ EMPLOYEESA
		next();
	};
}

function validateYear(year: any): boolean {
	return typeof year === 'string' && /^(20)\d{2}$/.test(year);
}
