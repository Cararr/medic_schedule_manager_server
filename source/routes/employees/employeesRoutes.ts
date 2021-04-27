import express from 'express';
import { getAllEmployeesController } from '../../controllers/employees/employeesControllers';
export const employeesRouter = express.Router();

employeesRouter.get('/', getAllEmployeesController);
