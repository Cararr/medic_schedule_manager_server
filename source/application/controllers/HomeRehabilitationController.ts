import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Employee } from '../../domain/entities/Employee';
import { HomeRehabilitation } from '../../domain/entities/HomeRehabilitation';
import {
	formatDateString,
	incrementDateByDay,
	validateDateFormat,
	validateTimeFormat,
} from '../../../util/utilities';
import { BadRequestError, NotFoundError } from 'routing-controllers';

export class HomeRehabilitationController {
	static getByDate = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const date = req.query.date;
			if (!validateDateFormat(date))
				return res.status(400).send(new BadRequestError('Wrong date format'));

			const homeRehabilitations = await getRepository(HomeRehabilitation).find({
				relations: ['employee'],
				where: { date },
			});
			res.send({ homeRehabilitations });
		} catch (error) {
			next(error);
		}
	};

	static create = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const homeRehabilitationsRepository = getRepository(HomeRehabilitation);

			const dates: string[] = [];
			let currentDate = new Date(req.body.from);
			const end = new Date(req.body.to);
			while (currentDate <= end) {
				if (![0, 6].includes(currentDate.getDay()))
					dates.push(formatDateString(currentDate));
				currentDate = incrementDateByDay(currentDate);
			}

			const homeRehabilitation: HomeRehabilitation =
				req.body.homeRehabilitation;
			const createdHRs: HomeRehabilitation[] = [];

			for (const date of dates) {
				const newHR = homeRehabilitationsRepository.create({
					...homeRehabilitation,
					date,
				});
				createdHRs.push(newHR);
			}

			const response = await homeRehabilitationsRepository.save(createdHRs);
			res
				.status(201)
				.send({ message: 'Created.', homeRehabilitations: response });
		} catch (error) {
			next(error);
		}
	};

	static update = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const homeRehabilitationsRepository = getRepository(HomeRehabilitation);

			const oldHomeRehabilitation = await homeRehabilitationsRepository.findOne(
				req.params.id
			);

			if (!oldHomeRehabilitation)
				return res
					.status(404)
					.send(new NotFoundError('Home Rehabilitation not found.'));

			const error = verifyHomeRehabilitation(
				req.body.homeRehabilitation,
				req.body.employees
			);
			if (error) return res.status(400).send(error);

			await homeRehabilitationsRepository.update(
				oldHomeRehabilitation.id,
				req.body.homeRehabilitation
			);

			const homeRehabilitation = await homeRehabilitationsRepository.findOne(
				oldHomeRehabilitation.id
			);

			res.send({
				message: 'Updated.',
				homeRehabilitation,
			});
		} catch (error) {
			next(error);
		}
	};

	static delete = async (req: Request, res: Response, next: NextFunction) => {
		const homeRehabilitationsRepository = getRepository(HomeRehabilitation);
		const homeRehabilitation = await homeRehabilitationsRepository.findOne(
			req.params.id
		);

		if (!homeRehabilitation)
			return res
				.status(404)
				.send(new NotFoundError('Home Rehabilitation not found.'));

		await homeRehabilitationsRepository.remove(homeRehabilitation);
		res.status(204).send();
	};

	static verifyCreatePayload = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		if (!validateDateFormat(req.body.from) || !validateDateFormat(req.body.to))
			return new BadRequestError('Wrong date format.');

		const error = verifyHomeRehabilitation(
			req.body.homeRehabilitation,
			req.body.employees
		);
		if (error) return res.status(400).send(error);

		next();
	};
}

const verifyHomeRehabilitation = (
	homeRehabilitation: HomeRehabilitation,
	employees: [Employee]
): BadRequestError | boolean => {
	if (!homeRehabilitation)
		return new BadRequestError(
			'Request is missing homeRehabilitation property.'
		);
	if (!validateTimeFormat(homeRehabilitation.startTime))
		return new BadRequestError('Wrong time format.');
	if (typeof homeRehabilitation.patient !== 'string')
		return new BadRequestError('Wrong patient format.');
	if (!homeRehabilitation.employee)
		return new BadRequestError('No Employee included.');
	if (
		!employees.some(
			(emp: Employee) => emp.id === homeRehabilitation.employee.id
		)
	)
		return new BadRequestError('No employee match.');

	return false;
};
