import express from 'express';
import { getSchedulesByStationAndDate } from '../../controllers/schedules/schedulesControllers';
export const schedulesRouter = express.Router();

schedulesRouter.get(
	['/kineza', '/fizyko', '/masaz'],
	getSchedulesByStationAndDate
);
