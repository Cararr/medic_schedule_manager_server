import { Request, Response, NextFunction } from 'express';
import { employee } from '../../../typesDefs/types';
import { pool } from '../../../configs/pgconfig';
export const getAllEmployeesController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const response = await pool.query('SELECT * FROM employees;');
		const formatedResponse = formatEmployeesList(response.rows);
		res.send(formatedResponse);
	} catch (error) {
		next(error);
	}
};
function formatEmployeesList(employeesList: employee[]): string[] {
	return employeesList.map(
		(employee) => `${employee.name} ${employee.last_name}`
	);
}
