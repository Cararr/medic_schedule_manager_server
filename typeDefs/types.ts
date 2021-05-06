export interface dbSearchIdListResults {
	[cell: string]: number | null;
}
export interface fullDailySchedule {
	[date: string]: {
		KINEZA: string[];
		FIZYKO: string[];
		MASAZ: string[];
	};
}
export interface employee {
	id: number;
	name: string;
	last_name: string;
}
