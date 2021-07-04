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
	ScheduleController.getScheduleByDate
);

scheduleRouter.get(
	'/schedules/generate',
	validateToken,
	preloadStationsAndEmployees,
	ScheduleController.generateScheudle
);

scheduleRouter.post(
	'/schedules',
	validateToken,
	verifyPermissions,
	preloadStationsAndEmployees,
	ScheduleController.createSchedulesBodyVeryfier,
	ScheduleController.verifySchedulesPayload,
	ScheduleController.createSchedules
);

scheduleRouter.put(
	'/schedules/:date',
	validateToken,
	verifyPermissions,
	preloadStationsAndEmployees,
	ScheduleController.saveScheduleReqVeryfier,
	ScheduleController.verifySchedulesPayload,
	ScheduleController.saveSchedule
);

scheduleRouter.delete(
	'/schedules/:date',
	validateToken,
	verifyPermissions,
	ScheduleController.deleteScheduleByDate
);
