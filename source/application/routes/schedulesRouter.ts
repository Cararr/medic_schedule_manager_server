import express from 'express';
import { ScheduleController } from '../controllers/ScheduleController';
export const schedulesRouter = express.Router();

schedulesRouter.get(
	'/schedule',
	ScheduleController.loadStationsAndEmployees,
	ScheduleController.getScheduleByDate
);

schedulesRouter.post(
	'/schedule',
	ScheduleController.loadStationsAndEmployees,
	ScheduleController.saveScheduleReqVeryfier,
	ScheduleController.saveSchedule
);

schedulesRouter.delete('/schedule', ScheduleController.deleteScheduleByDate);

schedulesRouter.get(
	'/schedule/generate',
	ScheduleController.loadStationsAndEmployees,
	ScheduleController.generateScheudle
);
