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
			const homeRehabilitaitonsRepository = getRepository(HomeRehabilitation);

			const homeRehabilitaitons = req.body.homeRehabilitaitons;

			const createdHomeRehabilitaitonsIds =
				await homeRehabilitaitonsRepository.insert(homeRehabilitaitons);

			homeRehabilitaitons.forEach((hR: HomeRehabilitation, index: number) => {
				hR.id = createdHomeRehabilitaitonsIds.identifiers[index].id;
			});

			res.status(201).send({
				message: 'Created.',
				homeRehabilitaitons,
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
		const homeRehabilitaitonsRepository = getRepository(HomeRehabilitation);

		const homeRehabilitation = await homeRehabilitaitonsRepository.findOne(
			req.params.id
		);

		if (!homeRehabilitation)
			return res
				.status(404)
				.send(new NotFoundError('Home Rehabilitaiton not found.'));

		const error = verifyHomeRehabilitation(
			req.body.homeRehabilitaiton,
			req.body.employees
		);
		if (error) return res.status(400).send(error);

		await homeRehabilitaitonsRepository.update(
			homeRehabilitation.id,
			req.body.homeRehabilitaiton
		);

		const updatedHomeRehabilitation =
			await homeRehabilitaitonsRepository.findOne(homeRehabilitation.id);

		res.send({
			message: 'Updated.',
			homeRehabilitation: updatedHomeRehabilitation,
		});
	};

	static deleteHomeRehabilitaiton = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const homeRehabilitaitonsRepository = getRepository(HomeRehabilitation);
		const homeRehabilitation = await homeRehabilitaitonsRepository.findOne(
			req.params.id
		);

		if (!homeRehabilitation)
			return res
				.status(404)
				.send(new NotFoundError('Home Rehabilitaiton not found.'));

		await homeRehabilitaitonsRepository.remove(homeRehabilitation);
		res.status(204).send();
	};

	static createHomeRehabilitationsBodyVeryfier = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		if (!Array.isArray(req.body.homeRehabilitaitons))
			return res
				.status(400)
				.send(new BadRequestError('homeRehabilitations is not an array.'));

		for (const hReh of req.body.homeRehabilitaitons) {
			const error = verifyHomeRehabilitation(hReh, req.body.employees);
			if (error) return res.status(400).send(error);
		}
		next();
	};
}

const verifyHomeRehabilitation = (
	homeRehabilitaiton: any,
	employees: [Employee]
): BadRequestError | boolean => {
	if (!validateDateFormat(homeRehabilitaiton.date))
		return new BadRequestError('Wrong date format.');
	if (!validateTimeFormat(homeRehabilitaiton.startTime))
		return new BadRequestError('Wrong time format.');
	if (typeof homeRehabilitaiton.patient !== 'string')
		return new BadRequestError('Wrong patient format.');
	if (
		!employees.some(
			(emp: Employee) => emp.id === homeRehabilitaiton.employee.id
		)
	)
		return new BadRequestError('No employee match.');

	return false;
};
