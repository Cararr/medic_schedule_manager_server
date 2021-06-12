import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Employee } from '../../domain/entities/Employee';
import { TOKEN_EXPIRE_TIME } from '../../../configs/config.json';
import { NotFoundError } from 'routing-controllers';
import bcrypt from 'bcryptjs';
import createJWT from '../../../util/createJWT';

export class LoginController {
	static login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { lastName, password } = req.body;

			const user = await getRepository(Employee).findOne({
				select: ['firstName', 'lastName', 'password', 'id', 'role'],
				where: { lastName: lastName },
			});

			if (!user)
				return res.status(404).send(new NotFoundError('Employee not found!'));

			const match = await bcrypt.compare(password, user.password);

			if (match) {
				delete user.password;
				createJWT(user, (error, token) => {
					if (error) next(error);
					else if (token) {
						const cookieMaxAge = TOKEN_EXPIRE_TIME * 1000;
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
				res.status(401).send({ message: 'Wrong password!' });
			}
		} catch (error) {
			next(error);
		}
	};

	static loginBodyVeryfier = (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		if (req.body.lastName && req.body.password) next();
		else
			res.status(400).send({ message: "Missing employee's name or password." });
	};
}
