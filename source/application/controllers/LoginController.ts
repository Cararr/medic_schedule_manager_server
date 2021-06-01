import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Employee } from '../../domain/entities/Employee';
import bcrypt from 'bcryptjs';
import createJWT from '../../../util/createJWT';
import { user } from '../../../typeDefs/types';

export class LoginController {
	static login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { lastName, password } = req.body;

			const employee = await getRepository(Employee).findOne({
				select: ['lastName', 'password', 'id', 'role'],
				where: { lastName: lastName },
			});

			if (!employee)
				return res.status(404).json({ message: 'Employee not found.' });

			const match = await bcrypt.compare(password, employee.password);

			const employeeUser: user = {
				id: employee.id,
				role: employee.role,
			};

			if (match) {
				createJWT(employeeUser, (error, token) => {
					if (error) next(error);
					else if (token) {
						res.cookie('token', token, { httpOnly: true });
						return res.json({ message: 'Login passed.', token, employeeUser });
					}
				});
			} else {
				res.status(401).json({ message: 'Wrong password.' });
			}
		} catch (error) {
			next(error);
		}
	};
}
