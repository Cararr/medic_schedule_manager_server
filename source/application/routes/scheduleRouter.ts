import express from 'express';
import { ScheduleController } from '../controllers/ScheduleController';
import validateToken from '../middleware/validateJWT';
import verifyPermissions from '../middleware/verifyPermissions';
import preloadStationsAndEmployees from '../middleware/preloadStationsAndEmployees';

export const scheduleRouter = express.Router();

scheduleRouter.get(
	'/schedules',
	validateToken,
	preloadStationsAndEmployees,
	ScheduleController.getByDate
);

scheduleRouter.get(
	'/schedules/generate',
	validateToken,
	preloadStationsAndEmployees,
	ScheduleController.generate
);

scheduleRouter.post(
	'/schedules',
	validateToken,
	verifyPermissions,
	preloadStationsAndEmployees,
	ScheduleController.verifyPayload,
	ScheduleController.create
);

scheduleRouter.put(
	'/schedules/:date',
	validateToken,
	verifyPermissions,
	preloadStationsAndEmployees,
	ScheduleController.verifyUpdatePayload,
	ScheduleController.verifyPayload,
	ScheduleController.update
);

scheduleRouter.delete(
	'/schedules/:date',
	validateToken,
	verifyPermissions,
	ScheduleController.deleteByDate
);
