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
	ScheduleController.reqBodyVeryfier,
	ScheduleController.saveSchedule
);

schedulesRouter.get(
	'/schedule/generate',
	ScheduleController.loadStationsAndEmployees,
	ScheduleController.generateScheudle
);
