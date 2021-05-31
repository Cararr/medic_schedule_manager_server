import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../../../configs/config.json';

const validateToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers.authorization?.split(' ')[1];

	if (token) {
		jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
			if (error)
				return res.status(401).send({
					message: error.message,
					error,
				});
			else {
				res.locals.token = decoded;
				req.body.token = decoded;
				next();
			}
		});
	} else {
		return res.status(401).json({ message: 'Authorization failed.' });
	}
};

export default validateToken;
