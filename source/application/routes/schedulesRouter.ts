import express from 'express';
import { ScheduleController } from '../controllers/ScheduleController';
export const schedulesRouter = express.Router();
import validateToken from '../middleware/validateJWT';

schedulesRouter.get(
	'/schedule',
	validateToken,
	ScheduleController.loadStationsAndEmployees,
	ScheduleController.getScheduleByDate
);

schedulesRouter.put(
	'/schedule/:date',
	validateToken,
	ScheduleController.loadStationsAndEmployees,
	ScheduleController.saveScheduleReqVeryfier,
	ScheduleController.saveSchedule
);

schedulesRouter.delete(
	'/schedule/:date',
	validateToken,
	ScheduleController.deleteScheduleByDate
);

schedulesRouter.get(
	'/schedule/generate',
	validateToken,
	ScheduleController.loadStationsAndEmployees,
	ScheduleController.generateScheudle
);
