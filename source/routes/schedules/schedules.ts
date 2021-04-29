import express from 'express';
import {
	getSchedulesByDate,
	getSchedulesByStationAndDate,
} from '../../controllers/schedules/schedulesControllers';
export const schedulesRouter = express.Router();

schedulesRouter.get('/', getSchedulesByDate);
schedulesRouter.get(
	['/kineza', '/fizyko', '/masaz'],
	getSchedulesByStationAndDate
);
