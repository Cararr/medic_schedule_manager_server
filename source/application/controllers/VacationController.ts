import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from 'routing-controllers';
import { Between, getRepository } from 'typeorm';
import { validateDateFormat, validateYear } from '../../../util/utilities';
import { Employee } from '../../domain/entities/Employee';
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

			const vacations = await getRepository(Vacation).find({
				relations: ['employee'],
				where: [
					{
						from: Between(`${year}-01-01`, `${year}-12-31`),
					},
					{
						to: Between(`${year}-01-01`, `${year}-12-31`),
					},
				],
			});

			res.send({ vacations });
		} catch (error) {
			next(error);
		}
	};

	static create = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const vacationRepository = getRepository(Vacation);

			const vacation = vacationRepository.create(req.body.vacation);
			await vacationRepository.save(vacation);
			res.send({ message: 'Created.', vacation });
		} catch (error) {
			next(error);
		}
	};

	static verifyPayload = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		if (typeof req.body.vacation !== 'object')
			return res
				.status(400)
				.send(new BadRequestError('No vacation object provided.'));

		if (
			!validateDateFormat(req.body.vacation.from) ||
			!validateDateFormat(req.body.vacation.to)
		)
			return res.status(400).send(new BadRequestError('Invalid date.'));

		if (
			!req.body.employees.some(
				(employee: Employee) => employee.id === req.body.vacation.employee.id
			)
		)
			return res.status(400).send(new BadRequestError('Employee not exist.'));

		next();
	};
}
