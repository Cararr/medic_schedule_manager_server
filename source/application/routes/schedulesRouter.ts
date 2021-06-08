import express from 'express';
import { ScheduleController } from '../controllers/ScheduleController';
export const schedulesRouter = express.Router();
import validateToken from '../middleware/validateJWT';

schedulesRouter.get(
	'/schedules',
	validateToken,
	ScheduleController.loadStationsAndEmployees,
	ScheduleController.getScheduleByDate
);

schedulesRouter.put(
	'/schedules/:date',
	validateToken,
	ScheduleController.loadStationsAndEmployees,
	ScheduleController.saveScheduleReqVeryfier,
	ScheduleController.saveSchedule
);

schedulesRouter.delete(
	'/schedules/:date',
	validateToken,
	ScheduleController.deleteScheduleByDate
);

schedulesRouter.get(
	'/schedules/generate',
	validateToken,
	ScheduleController.loadStationsAndEmployees,
	ScheduleController.generateScheudle
);
