import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Employee } from '../../domain/entities/Employee';
import { HomeRehabilitation } from '../../domain/entities/HomeRehabilitation';
import {
	validateDateFormat,
	validateTimeFormat,
} from '../../../util/utilities';
import { BadRequestError, NotFoundError } from 'routing-controllers';

export class HomeRehabilitationController {
	static getHomeRehabilitationsByDate = async (
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

	static createHomeRehabilitations = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const homeRehabilitationsRepository = getRepository(HomeRehabilitation);

			const homeRehabilitations = req.body.homeRehabilitations;

			const createdhomeRehabilitationsIds =
				await homeRehabilitationsRepository.insert(homeRehabilitations);

			homeRehabilitations.forEach((hR: HomeRehabilitation, index: number) => {
				hR.id = createdhomeRehabilitationsIds.identifiers[index].id;
			});

			res.status(201).send({
				message: 'Created.',
				homeRehabilitations,
			});
		} catch (error) {
			next(error);
		}
	};

	static updateHomeRehabilitation = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const homeRehabilitationsRepository = getRepository(HomeRehabilitation);

			const homeRehabilitation = await homeRehabilitationsRepository.findOne(
				req.params.id
			);

			if (!homeRehabilitation)
				return res
					.status(404)
					.send(new NotFoundError('Home Rehabilitation not found.'));

			const error = verifyHomeRehabilitation(
				req.body.homeRehabilitation,
				req.body.employees
			);
			if (error) return res.status(400).send(error);

			await homeRehabilitationsRepository.update(
				homeRehabilitation.id,
				req.body.homeRehabilitation
			);

			const updatedHomeRehabilitation =
				await homeRehabilitationsRepository.findOne(homeRehabilitation.id);

			res.send({
				message: 'Updated.',
				homeRehabilitation: updatedHomeRehabilitation,
			});
		} catch (error) {
			next(error);
		}
	};

	static deleteHomeRehabilitation = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
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

	static createHomeRehabilitationsBodyVeryfier = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		if (!Array.isArray(req.body.homeRehabilitations))
			return res
				.status(400)
				.send(new BadRequestError('homeRehabilitations is not an array.'));

		if (req.body.homeRehabilitations.length > 100)
			return res
				.status(400)
				.send(
					new BadRequestError(
						'Excessive homeRehabilitations size. Maximum home rehabilitations to create per request is 100'
					)
				);

		for (const hReh of req.body.homeRehabilitations) {
			const error = verifyHomeRehabilitation(hReh, req.body.employees);
			if (error) return res.status(400).send(error);
		}
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
	if (!validateDateFormat(homeRehabilitation.date))
		return new BadRequestError('Wrong date format.');
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
