import { Request, Response, NextFunction } from 'express';
import { pool } from '../../../configs/pgconfig';
import { convertArrayOfNamesToIds } from '../../../util/utilities';
import {
	dbSearchIdListResults,
	fullDailySchedule,
	employee,
} from '../../../typeDefs/types';
import { loadEmployees } from '../../resources/employeesList';

let employees: employee[];
loadEmployees.then((response) => {
	employees = response;
});

export const postSchedulesByDate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const newSchedule: fullDailySchedule = req.body;

		const date: string = Object.keys(newSchedule)[0];
		if (!dateValidator(date))
			next(new Error('missing date or wrong date format!'));

		const kinezaSchedule = newSchedule[date].KINEZA;
		const fizykoSchedule = newSchedule[date].FIZYKO;
		const masazSchedule = newSchedule[date].MASAZ;

		const validateSchedules = validateNewSchedule(
			kinezaSchedule,
			fizykoSchedule,
			masazSchedule
		);
		if (validateSchedules) next(new Error(validateSchedules));

		const kinezaIdSchedule = convertArrayOfNamesToIds(
			employees,
			kinezaSchedule
		);
		const fizykoIdSchedule = convertArrayOfNamesToIds(
			employees,
			fizykoSchedule
		);
		const masazIdSchedule = convertArrayOfNamesToIds(employees, masazSchedule);
		console.log(kinezaIdSchedule, fizykoIdSchedule, masazIdSchedule);

		const scheduleQueryText =
			'INSERT INTO SCHEDULES (DATE) VALUES ($1) RETURNING *;';
		const createScheduleResponse = await pool.query(scheduleQueryText, [date]);
	} catch (error) {
		next(error);
	}
};

function dateValidator(date: string): boolean {
	const regexp = /^\d{4}[\-\/\s]?((((0[13578])|(1[02]))[\-\/\s]?(([0-2][0-9])|(3[01])))|(((0[469])|(11))[\-\/\s]?(([0-2][0-9])|(30)))|(02[\-\/\s]?[0-2][0-9]))$/;
	return regexp.test(date);
}
function validateNewSchedule(
	kineza: string[],
	fizyko: string[],
	masaz: string[]
): string {
	if (!kineza) return 'missing kineza station schedule!';
	if (!fizyko) return 'missing fizyko station schedule!';
	if (!masaz) return 'missing masaz station schedule!';
	if (!validateStationArray(kineza, 'KINEZA'))
		return 'invalid kineza station values';
	if (!validateStationArray(fizyko, 'FIZYKO'))
		return 'invalid fizyko station values';
	if (!validateStationArray(masaz, 'MASAZ'))
		return 'invalid masaz station values';
	return '';
}
function validateStationArray(
	stationArray: string[],
	stationType: string
): boolean {
	switch (stationType) {
		case 'KINEZA':
			return stationArray.length === 10;
		case 'FIZYKO':
			return stationArray.length === 8;
		case 'MASAZ':
			return stationArray.length === 4;
		default:
			return false;
	}
}
