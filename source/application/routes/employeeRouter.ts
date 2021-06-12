import express from 'express';
import { EmployeeController } from '../controllers/EmployeeController';
export const employeeRouter = express.Router();
import validateToken from '../middleware/validateJWT';

employeeRouter.get(
	'/employees',
	validateToken,
	EmployeeController.getAllEmployees
);
