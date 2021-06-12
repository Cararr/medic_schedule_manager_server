import express from 'express';
import { WorkStageSpanController } from '../controllers/WorkStageSpanController';
export const workStageSpanRouter = express.Router();

workStageSpanRouter.get(
	'/workstagespans',
	WorkStageSpanController.getAllWorkStageSpans
);
