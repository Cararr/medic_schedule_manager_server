import express from 'express';
import { EmployeeController } from '../controllers/EmployeeController';
export const employeesRouter = express.Router();

employeesRouter.get('/employees', EmployeeController.getAllEmployees);
