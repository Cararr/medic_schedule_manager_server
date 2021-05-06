import express from 'express';
import {
	getSchedulesByDate,
	getSchedulesByStationAndDate,
} from '../../controllers/schedules/getSchedulesControllers';
import { postSchedulesByDate } from '../../controllers/schedules/postSchedulesController';
export const schedulesRouter = express.Router();

schedulesRouter.get('/', getSchedulesByDate);
schedulesRouter.get(
	['/kineza', '/fizyko', '/masaz'],
	getSchedulesByStationAndDate
);

schedulesRouter.post('/', postSchedulesByDate);
