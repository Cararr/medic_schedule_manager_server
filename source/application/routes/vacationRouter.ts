import express from 'express';
import { VacationController } from '../controllers/VacationController';
import validateToken from '../middleware/validateJWT';
import preloadStationsAndEmployees from '../middleware/preloadStationsAndEmployees';
import verifyPermissions from '../middleware/verifyPermissions';

export const vacationRouter = express.Router();

vacationRouter.get('/vacations', validateToken, VacationController.getByYear);

vacationRouter.post(
	'/vacations',
	validateToken,
	verifyPermissions,
	preloadStationsAndEmployees,
	VacationController.verifyPayload,
	VacationController.create
);

vacationRouter.put(
	'/vacations/:id',
	validateToken,
	verifyPermissions,
	preloadStationsAndEmployees,
	VacationController.verifyPayload,
	VacationController.update
);

vacationRouter.delete(
	'/vacations/:id',
	validateToken,
	verifyPermissions,
	VacationController.delete
);
