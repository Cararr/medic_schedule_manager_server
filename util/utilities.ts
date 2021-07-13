import { Station } from '../source/domain/entities/Station';

export function validateDateFormat(date: any): boolean {
	return /^\d{4}[-](0?[1-9]|1[012])[-](0?[1-9]|[12][0-9]|3[01])$/.test(date);
}

/**
 *
 * @param time time string to veryfy. Correct format should be hh:mm:ss
 * @returns boolean pass or no
 */
export function validateTimeFormat(time: any): boolean {
	return /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(time);
}

export function incrementDateByDay(date: Date) {
	return new Date(date.setDate(date.getDate() + 1));
}

export function formatDateString(date: Date) {
	const dateArray = date.toLocaleDateString().split('.');
	const day = Number(dateArray[0]) < 10 ? `0${dateArray[0]}` : dateArray[0];
	return `${dateArray[2]}-${dateArray[1]}-${day}`;
}

export function orderStations(stations: Station[]): Station[] {
	const orderedStations: Station[] = [];

	for (const station of stations) {
		switch (station.name) {
			case 'KINEZA':
				orderedStations[0] = station;
				break;
			case 'FIZYKO':
				orderedStations[1] = station;
				break;
			case 'MASAZ':
				orderedStations[2] = station;
				break;
			case 'WIZYTY':
				orderedStations[3] = station;
				break;
			default:
				console.error('Station name not recognized.');
		}
	}
	return orderedStations;
}
