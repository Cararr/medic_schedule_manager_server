import { Pool } from 'pg';
export const pool = new Pool({
	user: 'postgres',
	password: 'kami1l',
	host: 'localhost',
	port: 5432,
	database: 'Schedule Manager',
});
