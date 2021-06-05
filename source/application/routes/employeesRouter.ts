import express from 'express';
import { EmployeeController } from '../controllers/EmployeeController';
export const employeesRouter = express.Router();
import validateToken from '../middleware/validateJWT';

employeesRouter.get(
	'/employees',
	validateToken,
	EmployeeController.getAllEmployees
);
