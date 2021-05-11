import { Employee } from '../source/entities/Employee';
export interface dailySchedule {
	[date: string]: {
		[station: string]: (Employee | null)[];
	};
}
