import { pool } from '../../pgconfig';
import { employee } from '../../types/types';

export const loadEmployees: Promise<employee[]> = new Promise(
	async (resolve, reject) => {
		const response = await pool.query('SELECT * FROM employees;');
		const employees: employee[] = response.rows;
		resolve(employees);
		reject([]);
	}
);
