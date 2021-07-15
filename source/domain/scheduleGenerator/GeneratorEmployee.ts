import { Employee } from '../entities/Employee';
import { Station } from '../entities/Station';

export enum shift {
	MORNING = 'MORNING',
	EVENING = 'EVENING',
}

export class GeneratorEmployee {
	employee: Employee;
	shift: shift;
	stationsTaken: Station[];

	constructor(employee: Employee, shift: shift) {
		this.employee = employee;
		this.shift = shift;
		this.stationsTaken = [];
	}
}
