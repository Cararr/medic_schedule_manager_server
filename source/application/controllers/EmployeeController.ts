import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Employee } from '../../domain/entities/Employee';

export class EmployeeController {
	static getAllEmployees = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const employees = await getRepository(Employee).find();
			res.send({ employees });
		} catch (error) {
			next(error);
		}
	};
}
