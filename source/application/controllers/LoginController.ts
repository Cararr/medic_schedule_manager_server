import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Employee } from '../../domain/entities/Employee';
import { BadRequestError, UnauthorizedError } from 'routing-controllers';
import createJWT from '../../../util/createJWT';
import bcrypt from 'bcryptjs';
import _ from 'lodash';
import dotenv from 'dotenv';

dotenv.config();

export class LoginController {
	static login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { lastName, password } = req.body;

			const user = await getRepository(Employee).findOne({
				select: ['firstName', 'lastName', 'password', 'id', 'role'],
				where: { lastName: _.trim(lastName) },
			});

			if (!user)
				return res
					.status(401)
					.send(new UnauthorizedError('Employee not found!'));

			const match = await bcrypt.compare(password, user.password);

			if (match) {
				delete user.password;
				createJWT(user, (error, token) => {
					if (error) next(error);
					else if (token) {
						const cookieMaxAge = Number(process.env.TOKEN_EXPIRE_TIME) * 1000;
						res
							.cookie('token', token, {
								httpOnly: true,
								maxAge: cookieMaxAge,
								sameSite: 'strict',
							})
							.cookie('user', JSON.stringify(user), {
								maxAge: cookieMaxAge,
								sameSite: 'strict',
							});
						return res.status(201).send({ message: 'Login passed.', user });
					}
				});
			} else {
				res.status(401).send(new UnauthorizedError('Wrong password!'));
			}
		} catch (error) {
			next(error);
		}
	};

	static verifyPayload = (req: Request, res: Response, next: NextFunction) => {
		if (req.body.lastName && req.body.password) next();
		else
			res
				.status(400)
				.send(new BadRequestError("Missing employee's name or password."));
	};
}
