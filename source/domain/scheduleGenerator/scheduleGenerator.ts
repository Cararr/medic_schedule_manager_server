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

	let schedule: dailySchedule = {};
	for (const station of stations) {
		schedule[station.name] = new Array(station.numberOfCellsInTable).fill(null);
	}
	employees.forEach((employee) => {
		if (employee.shift === 'MORNING')
			schedule = updateSchedule(stations, employee, schedule, 1);

		schedule = updateSchedule(stations, employee, schedule, 2);
	});

	while (_.isNull(schedule['MASAZ'][2]) || _.isNull(schedule['WIZYTY'][0])) {
		clearThirdShift(schedule);
		employees.forEach((employee) => {
			resetStationsTaken(employee);
			schedule = updateSchedule(stations, employee, schedule, 3);
		});
	}

	employees.forEach((employee) => {
		if (employee.shift === 'EVENING')
			schedule = updateSchedule(stations, employee, schedule, 4);
	});

	return schedule;
};

function updateSchedule(
	stations: Station[],
	employee: GeneratorEmployee,
	schedule: dailySchedule,
	shift: number
): dailySchedule {
	const updatedSchedule: dailySchedule = _.cloneDeep(schedule);
	let nextStation: Station;
	let tableIndex: number;
	const previousStation = _.last(employee.stationsTaken);
	const kinezaStation = stations.find((station) => station.name === 'KINEZA');
	const fizykoStation = stations.find((station) => station.name === 'FIZYKO');
	const masazStation = stations.find((station) => station.name === 'MASAZ');
	const wizytyStation = stations.find((station) => station.name === 'WIZYTY');

	let timesFailed = 0; //if it is not possible to change station it shoult repeat the station

	if (shift === 1) {
		console.log(1);
		while (_.isUndefined(tableIndex)) {
			nextStation = stations[_.random(2)];

			tableIndex = findFirstEmpty(
				updatedSchedule[nextStation.name],
				WORKSTAGESPANS.FIRST
			);
		}
	} else if (shift === 2) {
		console.log(2);
		while (_.isUndefined(tableIndex)) {
			if (employee.stationsTaken.includes(masazStation))
				nextStation = stations[_.random(1)];
			else
				nextStation =
					previousStation === fizykoStation
						? _.sample([kinezaStation, masazStation])
						: stations[_.random(2)];

			tableIndex = findFirstEmpty(
				updatedSchedule[nextStation.name],
				WORKSTAGESPANS.SECOND
			);
		}
	} else if (shift === 3) {
		while (_.isUndefined(tableIndex)) {
			// console.log(3);
			if (employee.stationsTaken.includes(masazStation)) {
				nextStation = _.sample(
					previousStation === fizykoStation
						? [kinezaStation, wizytyStation]
						: [kinezaStation, fizykoStation, wizytyStation]
				);
			} else if (previousStation === fizykoStation && timesFailed <= 5) {
				nextStation = _.sample([kinezaStation, masazStation, wizytyStation]);
				timesFailed++;
			} else if (
				employee.stationsTaken[0] === kinezaStation &&
				employee.stationsTaken[1] === kinezaStation
			) {
				nextStation = stations[_.random(1, 3)];
			} else {
				nextStation = stations[_.random(3)];
			}

			// console.log(employee, nextStation, updatedSchedule);
			tableIndex = findFirstEmpty(
				updatedSchedule[nextStation.name],
				nextStation === wizytyStation
					? WORKSTAGESPANS.FIRST
					: WORKSTAGESPANS.THIRD
			);
		}
	} else if (shift === 4) {
		while (_.isUndefined(tableIndex)) {
			// if (timesFailed > 10) return schedule;
			if (employee.stationsTaken.includes(masazStation)) {
				console.log(4.1);
				if (previousStation === fizykoStation) nextStation = kinezaStation;
				else nextStation = _.sample([kinezaStation, fizykoStation]);
			} else if (previousStation === fizykoStation) {
				console.log(4.2);
				nextStation = _.sample([kinezaStation, masazStation]);
			} else if (
				employee.stationsTaken[0] === kinezaStation &&
				employee.stationsTaken[1] === kinezaStation
			) {
				console.log(4.3);
				nextStation = stations[_.random(1, 2)];
			} else {
				console.log(4.4);
				nextStation = stations[_.random(0, 2)];
			}
			timesFailed++;
			tableIndex = findFirstEmpty(
				updatedSchedule[nextStation.name],
				WORKSTAGESPANS.FOURTH
			);
		}
	}

	employee.stationsTaken.push(nextStation);
	updatedSchedule[nextStation.name][tableIndex] = employee.employee;
	return updatedSchedule;
}

function findFirstEmpty(
	schedule: (Employee | null)[],
	cellNumbers: number[]
): number {
	for (const index of cellNumbers) {
		if (schedule[index] === null) return index;
	}
}

function resetStationsTaken(employee: GeneratorEmployee) {
	if (employee.shift === 'MORNING' && employee.stationsTaken.length > 2)
		employee.stationsTaken.splice(2);
	if (employee.shift === 'EVENING') employee.stationsTaken.splice(1);
}

function clearThirdShift(schedule: dailySchedule) {
	for (const station in schedule) {
		if (Object.prototype.hasOwnProperty.call(schedule, station)) {
			switch (station) {
				case 'KINEZA':
					WORKSTAGESPANS.THIRD.forEach((index) => {
						schedule[station][index] = null;
					});
					break;
				case 'FIZYKO':
					[2, 6, 9].forEach((index) => {
						schedule[station][index] = null;
					});
					break;
				case 'MASAZ':
					schedule[station][2] = null;
					break;
				case 'WIZYTY':
					schedule[station][0] = null;
					break;
			}
		}
	}
}
