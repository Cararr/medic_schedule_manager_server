import { Request, Response, NextFunction } from 'express';
import { employeeRole } from '../../../typeDefs/types';
import { ForbiddenError } from 'routing-controllers';

const verifyPermissions = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const userRole = req.body.tokenDecoded.employee.role;
	userRole === employeeRole.BOSS
		? next()
		: res.status(403).send(new ForbiddenError());
};

export default verifyPermissions;
