import express from 'express';
import { VacationController } from '../controllers/VacationController';
import validateToken from '../middleware/validateJWT';
import preloadStationsAndEmployees from '../middleware/preloadStationsAndEmployees';

export const vacationRouter = express.Router();

vacationRouter.get('/vacations', validateToken, VacationController.getByYear);

vacationRouter.post(
	'/vacations',
	validateToken,
	preloadStationsAndEmployees,
	VacationController.verifyPayload,
	VacationController.create
);
