import jwt from 'jsonwebtoken';
import { Employee } from '../source/domain/entities/Employee';
import dotenv from 'dotenv';

dotenv.config();

const createJWT = (
	employee: Employee,
	callback: (error: Error | null, token: string | null) => void
): void => {
	try {
		jwt.sign(
			{ employee },
			process.env.TOKEN_SECRET,
			{
				issuer: process.env.TOKEN_ISSUER,
				expiresIn: Number(process.env.TOKEN_EXPIRE_TIME),
			},
			(error, token) => {
				if (error) {
					callback(error, null);
				} else if (token) {
					callback(null, token);
				}
			}
		);
	} catch (error) {
		callback(error, null);
	}
};

export default createJWT;
