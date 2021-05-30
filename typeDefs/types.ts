import { Employee } from '../source/domain/entities/Employee';
export interface dailyDateSchedule {
	[date: string]: {
		[station: string]: (Employee | null)[];
	};
}
export interface dailySchedule {
	[station: string]: (Employee | null)[];
}
export interface user {
	lastName: string;
	password: string;
}
