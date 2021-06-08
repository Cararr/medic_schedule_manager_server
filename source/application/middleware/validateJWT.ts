import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../../../configs/config.json';
import { UnauthorizedError } from 'routing-controllers';

const validateToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token: string = req.cookies.token;
	if (token) {
		jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
			if (error)
				return res.status(401).send({
					message: error.message,
					error,
				});
			else {
				req.body.tokenDecoded = decoded;
				next();
			}
		});
	} else {
		return res.status(401).json(new UnauthorizedError());
	}
};

export default validateToken;
