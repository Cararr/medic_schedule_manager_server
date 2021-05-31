import { Employee } from '../source/domain/entities/Employee';
export interface dailyDateSchedule {
	[date: string]: {
		[station: string]: (Employee | null)[];
	};
}
export interface dailySchedule {
	[station: string]: (Employee | null)[];
}
export enum employeeRole {
	BOSS = 'BOSS',
	EMPLOYEE = 'EMPLOYEE',
}
export interface user {
	id: string;
	role: employeeRole;
}
