import { Employee } from '../source/domain/entities/Employee';
export interface dailySchedule {
	[date: string]: {
		[station: string]: (Employee | null)[];
	};
}
