import { Employee } from '../entities/Employee';
import { Station } from '../entities/Station';

export enum Shift {
	MORNING = 'MORNING',
	EVENING = 'EVENING',
}

export class ScheduleGeneratorEmployee {
	employee: Employee;
	shift: Shift;
	stationsTaken: Station[];

	constructor(employee: Employee, shift: Shift) {
		this.employee = employee;
		this.shift = shift;
		this.stationsTaken = [];
	}
}
