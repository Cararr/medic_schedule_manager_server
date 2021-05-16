import express from 'express';
import { ScheduleController } from '../controllers/schedule/ScheduleController';
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
