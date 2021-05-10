import express from 'express';
import { EmployeeController } from '../controllers/employee/EmployeeController';
export const employeesRouter = express.Router();

employeesRouter.get('/employees', EmployeeController.getAllEmployees);
