import jwt from 'jsonwebtoken';
import {
	TOKEN_EXPIRE_TIME,
	TOKEN_ISSUER,
	TOKEN_SECRET,
} from '../configs/config.json';
import { user } from '../typeDefs/types';

const createJWT = (
	user: user,
	callback: (error: Error | null, token: string | null) => void
): void => {
	try {
		jwt.sign(
			{ lastName: user.lastName },
			TOKEN_SECRET,
			{
				issuer: TOKEN_ISSUER,
				expiresIn: TOKEN_EXPIRE_TIME,
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
