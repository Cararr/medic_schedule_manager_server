import express from 'express';
import { employeeController } from '../controllers/employees/employeesControllers';
export const employeesRouter = express.Router();

employeesRouter.get('/', employeeController.getAllEmployeesController);
