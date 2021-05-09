import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Employee } from '../../entities/Employee';

export class employeeController {
	static getAllEmployeesController = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const employees = await getRepository(Employee).find();
			res.json(employees);
		} catch (error) {
			next(error);
		}
	};
}
