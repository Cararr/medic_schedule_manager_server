import { Employee } from '../entities/Employee';
import { Station } from '../entities/Station';
import { dailySchedule } from '../../../typeDefs/types';
import { GeneratorEmployee, shift } from './GeneratorEmployee';
import _ from 'lodash';

const WORKSTAGESPANS = {
	FIRST: [0, 4],
	SECOND: [1, 5, 8, 10, 12],
	THIRD: [2, 6, 9, 11, 13],
	FOURTH: [3, 7],
};

export const scheduleGenerator = (
	employeesList: Employee[],
	stations: Station[]
): dailySchedule => {
	const employees: GeneratorEmployee[] = [];
	_.shuffle(employeesList).forEach((employee, index) => {
		const shiftType: shift = index < 5 ? shift.MORNING : shift.EVENING;
		employees.push(new GeneratorEmployee(employee, shiftType));
	});

	const schedule: dailySchedule = {};
	for (const station of stations) {
		schedule[station.name] = new Array(station.numberOfCellsInTable).fill(null);
	}

	// FIRST
	employees.forEach((employee, index) => {
		if (employee.shift === 'MORNING') {
			const station = stations[index % 3];
			const tableIndex = findFirstEmpty(
				schedule[station.name],
				WORKSTAGESPANS.FIRST
			);
			employee.stationsOccupied.push(station);
			schedule[station.name][tableIndex] = employee.employee;
		}
	});

	// SECOND
	employees.forEach((employee) => {
		let station: Station;
		let tableIndex: number;

		const previousStation = _.last(employee.stationsOccupied);

		while (_.isUndefined(tableIndex)) {
			if (employee.shift === 'MORNING') {
				station = returnDifferentStation(stations, previousStation);
			} else if (employee.shift === 'EVENING') {
				station = stations[_.random(2)];
			}
			tableIndex = findFirstEmpty(
				schedule[station.name],
				WORKSTAGESPANS.SECOND
			);
		}

		employee.stationsOccupied.push(station);
		schedule[station.name][tableIndex] = employee.employee;
	});

	// THIRD
	//JEST LIPA - EMP MOŻE MIEĆ DURGI RAZ MASAŻ
	employees.forEach((employee) => {
		const previousStation = _.last(employee.stationsOccupied);
		let station: Station;
		let tableIndex: number;

		while (_.isUndefined(tableIndex)) {
			station = returnDifferentStation(stations, previousStation, true);
			tableIndex = findFirstEmpty(
				schedule[station.name],
				station.name === 'WIZYTY' ? [0] : WORKSTAGESPANS.THIRD
			);
		}

		employee.stationsOccupied.push(station);
		schedule[station.name][tableIndex] = employee.employee;
	});

	//FOURTH
	employees.forEach((employee, index) => {
		if (employee.shift === 'EVENING') {
			let station = stations[index % 3];
			let tableIndex = findFirstEmpty(
				schedule[station.name],
				WORKSTAGESPANS.FOURTH
			);
			if (_.isUndefined(tableIndex)) {
				station = stations[index % 4];
				tableIndex = findFirstEmpty(
					schedule[station.name],
					WORKSTAGESPANS.FOURTH
				);
			}

			employee.stationsOccupied.push(station);
			schedule[station.name][tableIndex] = employee.employee;
		}
	});

	return schedule;
};

function findFirstEmpty(
	schedule: (Employee | null)[],
	cellNumbers: number[]
): number {
	for (const index of cellNumbers) {
		if (schedule[index] === null) return index;
	}
}

function returnDifferentStation(
	stations: Station[],
	previousStation: Station,
	isThirdShift?: boolean
): Station {
	switch (previousStation.name) {
		case 'KINEZA':
			return _.sample(
				isThirdShift
					? [stations[1], stations[2], stations[3]]
					: [stations[1], stations[2]]
			);
		case 'FIZYKO':
			return isThirdShift ? stations[0] : _.sample([stations[0], stations[2]]);
		case 'MASAZ':
			return isThirdShift ? stations[0] : _.sample([stations[0], stations[1]]);
		case 'WIZYTY':
			return _.sample([stations[0], stations[1], stations[2]]);
		default:
			break;
	}
}
