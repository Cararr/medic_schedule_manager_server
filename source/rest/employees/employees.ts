import { pool } from '../../../pgconfig';
import { dbSearchResults } from '../../../types/types';
export const test = pool
	.query('SELECT * FROM employees;')
	.then((response) => response.rows)
	.catch((error) => console.error(error));
