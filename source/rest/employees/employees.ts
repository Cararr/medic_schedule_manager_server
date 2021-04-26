import express, { Request, Response, NextFunction } from 'express';
import { pool } from '../../../pgconfig';
import { employee } from '../../../types/types';
export const employeesRouter = express.Router();

employeesRouter.get(
	'/',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const response = await pool.query('SELECT * FROM employees;');
			const formatedRepsonse = formatEmployeesList(response.rows);
			res.send(formatedRepsonse);
		} catch (error) {
			console.error(error);
		}
	}
);

function formatEmployeesList(employeesList: employee[]): string[] {
	return employeesList.map(
		(employee) => `${employee.name} ${employee.last_name}`
	);
}
