import { Employee } from '../entities/Employee';
import { Station } from '../entities/Station';
import { dailySchedule, employeeRole } from '../../../typeDefs/types';
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

	let schedule: dailySchedule = {};
	for (const station of stations) {
		schedule[station.name] = new Array(station.numberOfCellsInTable).fill(null);
	}

	// FIRST
	employees.forEach((employee) => {
		if (employee.shift === 'MORNING')
			schedule = updateSchedule(stations, employee, schedule, 1);

		schedule = updateSchedule(stations, employee, schedule, 2);
		schedule = updateSchedule(stations, employee, schedule, 3);
	});

	// SECOND
	/* 	employees.forEach((employee) => {
		if (employee.shift === 'MORNING')
			schedule = updateSchedule(stations, employee, schedule, 2);
	}); */

	// THIRD
	/* employees.forEach((employee) => {
		while (_.isUndefined(tableIndex)) {
			station = returnNextStation(stations, employee.stationsTaken, true);
			tableIndex = findFirstEmpty(
				schedule[station.name],
				station.name === 'WIZYTY' ? [0] : WORKSTAGESPANS.THIRD
			);
		}

		employee.stationsTaken.push(station);
		schedule[station.name][tableIndex] = employee.employee;
		tableIndex = undefined;
	}); */

	//FOURTH
	/* employees.forEach((employee, index) => {
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

			employee.stationsTaken.push(station);
			schedule[station.name][tableIndex] = employee.employee;
		}
	}); */

	return schedule;
};

function updateSchedule(
	stations: Station[],
	employee: GeneratorEmployee,
	schedule: dailySchedule,
	shift: number
): dailySchedule {
	const newSchedule = schedule;
	let nextStation: Station;
	let tableIndex: number;
	const previousStation = _.last(employee.stationsTaken);
	const kinezaStation = stations.find((station) => station.name === 'KINEZA');
	const fizykoStation = stations.find((station) => station.name === 'FIZYKO');
	const masazStation = stations.find((station) => station.name === 'MASAZ');
	const wizytyStation = stations.find((station) => station.name === 'WIZYTY');
	let timesChangeFailed = 0;
	//PROBLEM - WIZYTY ALBO MASAZE 3 CZASEM NIE OBSADZONE.
	if (employee.stationsTaken.includes(masazStation)) {
		while (_.isUndefined(tableIndex)) {
			console.log(0);
			if (shift === 3 && previousStation === fizykoStation)
				nextStation = _.sample([kinezaStation, wizytyStation]);
			else
				nextStation = _.sample(
					shift === 3
						? [kinezaStation, fizykoStation, wizytyStation]
						: [kinezaStation, fizykoStation]
				);
			tableIndex = findFirstEmpty(
				newSchedule[nextStation.name],
				returnCorrectWorkStage(shift)
			);
		}
	} else if (shift === 1) {
		console.log(1);

		while (_.isUndefined(tableIndex)) {
			nextStation = stations[_.random(2)];

			tableIndex = findFirstEmpty(
				newSchedule[nextStation.name],
				WORKSTAGESPANS.FIRST
			);
		}
	} else if (shift === 2) {
		console.log(2);

		while (_.isUndefined(tableIndex)) {
			nextStation =
				previousStation === fizykoStation
					? _.sample([kinezaStation, masazStation])
					: stations[_.random(2)];

			tableIndex = findFirstEmpty(
				newSchedule[nextStation.name],
				WORKSTAGESPANS.SECOND
			);
		}
	} else if (shift === 3) {
		while (_.isUndefined(tableIndex)) {
			console.log(3);
			if (previousStation === fizykoStation && timesChangeFailed <= 5) {
				nextStation = _.sample([kinezaStation, masazStation, wizytyStation]);
				timesChangeFailed++; //if it is not possible to put employee outside of fizyko it shoult repeat this station
			} else if (
				employee.stationsTaken[0] === kinezaStation &&
				employee.stationsTaken[1] === kinezaStation
			) {
				nextStation = stations[_.random(1, 3)];
			} else {
				nextStation = stations[_.random(3)];
			}

			tableIndex = findFirstEmpty(
				newSchedule[nextStation.name],
				nextStation === wizytyStation
					? WORKSTAGESPANS.FIRST
					: WORKSTAGESPANS.THIRD
			);
		}
	}
	employee.stationsTaken.push(nextStation);
	newSchedule[nextStation.name][tableIndex] = employee.employee;
	return newSchedule;
}

function findFirstEmpty(
	schedule: (Employee | null)[],
	cellNumbers: number[]
): number {
	for (const index of cellNumbers) {
		if (schedule[index] === null) return index;
	}
}

function returnCorrectWorkStage(index: number): number[] {
	switch (index) {
		case 1:
			return WORKSTAGESPANS.FIRST;
		case 2:
			return WORKSTAGESPANS.SECOND;
		case 3:
			return WORKSTAGESPANS.THIRD;
		case 4:
			return WORKSTAGESPANS.FOURTH;
	}
}
