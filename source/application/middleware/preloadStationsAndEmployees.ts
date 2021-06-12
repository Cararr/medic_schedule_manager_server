import { Request, Response, NextFunction } from 'express';
import { Station } from '../../domain/entities/Station';
import { Employee } from '../../domain/entities/Employee';
import { getRepository } from 'typeorm';

const preloadStationsAndEmployees = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const stations = await getRepository(Station).find();
		const employees = await getRepository(Employee).find();
		req.body.stations = stations;
		req.body.employees = employees;
		next();
	} catch (error) {
		next(error);
	}
};

export default preloadStationsAndEmployees;
