import { Employee } from '../source/entities/Employee';
export interface dailySchedule {
	[date: string]: {
		KINEZA: Employee[];
		FIZYKO: Employee[];
		MASAZ: Employee[];
	};
}
