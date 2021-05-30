import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Employee } from '../../domain/entities/Employee';
import bcrypt from 'bcryptjs';
import createJWT from '../../../util/createJWT';

export class LoginController {
	static login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { lastName, password } = req.body;

			const employee = await getRepository(Employee).findOne({
				select: ['lastName', 'password', 'id'],
				where: { lastName: lastName },
			});

			if (!employee)
				return res.status(404).json({ message: 'Employee not found.' });

			const match = await bcrypt.compare(password, employee.password);

			if (match) {
				createJWT(employee, (error, token) => {
					if (error) next(error);
					else if (token) {
						delete employee.password;
						return res.json({ message: 'Login passed.', token, employee });
					}
				});
			} else {
				res.status(401).json({ message: 'Unauthorized.' });
			}
		} catch (error) {
			next(error);
		}
	};
}
