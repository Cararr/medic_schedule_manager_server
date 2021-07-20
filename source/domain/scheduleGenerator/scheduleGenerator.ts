import { Employee } from '../entities/Employee';
import { Station } from '../entities/Station';
import { dailySchedule } from '../../../typeDefs/types';
import { ScheduleGeneratorEmployee, shift } from './ScheduleGeneratorEmployee';
import _ from 'lodash';
import { IsNull } from 'typeorm';

const WORKSTAGESPANS = {
	FIRST: [0, 4],
	SECOND: [1, 5, 8, 10, 12],
	THIRD: [2, 6, 9, 11, 13],
	FOURTH: [3, 7],
};

export const scheduleGenerator = (
	employeesList: Employee[],
	stations: Station[],
	previousMorningEmployees: Employee[]
): dailySchedule => {
	const employees: ScheduleGeneratorEmployee[] = [];

	const adjustedEmployeeList = _.compact(
		employeesList
			.filter(
				(employee) =>
					!previousMorningEmployees.some((emp) => emp?.id === employee.id)
			)
			.concat(_.shuffle(previousMorningEmployees))
	);

	adjustedEmployeeList.forEach((employee, index) => {
		const shiftType = index < 5 ? shift.MORNING : shift.EVENING;
		employees.push(new ScheduleGeneratorEmployee(employee, shiftType));
	});

	let schedule: dailySchedule = {};
	for (const station of stations) {
		schedule[station.name] = new Array(station.numberOfCellsInTable).fill(null);
	}
	//Fill first and secound workStageSpan
	employees.forEach((employee) => {
		if (employee.shift === 'MORNING')
			schedule = updateSchedule(stations, employee, schedule, 1);

		schedule = updateSchedule(stations, employee, schedule, 2);
	});
	//Fill third workStageSpan
	while (_.isNull(schedule['MASAZ'][2]) || _.isNull(schedule['WIZYTY'][0])) {
		clearThirdShift(schedule);
		employees.forEach((employee) => {
			undoThirdStationTaken(employee);
			schedule = updateSchedule(stations, employee, schedule, 3);
		});
	}
	//Fourth
	const completeSchedule = assignFourthShift(
		schedule,
		stations,
		employees.filter((emp) => emp.shift === 'EVENING')
	);

	return completeSchedule !== 0
		? completeSchedule
		: scheduleGenerator(employeesList, stations, previousMorningEmployees);
};

function updateSchedule(
	stations: Station[],
	employee: ScheduleGeneratorEmployee,
	schedule: dailySchedule,
	shift: number
): dailySchedule {
	const updatedSchedule: dailySchedule = _.cloneDeep(schedule);
	let nextStation: Station;
	let tableIndex: number;
	const previousStation = _.last(employee.stationsTaken);
	const [kinezaStation, fizykoStation, masazStation, wizytyStation] =
		nameStations(stations);

	let timesFailed = 0; //if it is not possible to change station it shoult repeat the station

	if (shift === 1)
		while (_.isUndefined(tableIndex)) {
			nextStation = stations[_.random(2)];

			tableIndex = findFirstEmpty(
				updatedSchedule[nextStation.name],
				WORKSTAGESPANS.FIRST
			);
		}
	else if (shift === 2)
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
	else if (shift === 3)
		while (_.isUndefined(tableIndex)) {
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

			tableIndex = findFirstEmpty(
				updatedSchedule[nextStation.name],
				nextStation === wizytyStation
					? WORKSTAGESPANS.FIRST
					: WORKSTAGESPANS.THIRD
			);
		}
	else if (shift === 4)
		while (_.isUndefined(tableIndex)) {
			// if (timesFailed > 10) return schedule;
			if (
				employee.stationsTaken[0] === kinezaStation &&
				employee.stationsTaken[1] === kinezaStation
			) {
				nextStation = stations[_.random(1, 2)];
			} else if (employee.stationsTaken.includes(masazStation)) {
				nextStation = _.sample([kinezaStation, fizykoStation]);
			} else if (
				employee.stationsTaken[0] === fizykoStation &&
				employee.stationsTaken[1] === fizykoStation
			) {
				nextStation = _.sample([kinezaStation, masazStation]);
			} else {
				nextStation = stations[_.random(0, 2)];
			}
			timesFailed++;
			tableIndex = findFirstEmpty(
				updatedSchedule[nextStation.name],
				WORKSTAGESPANS.FOURTH
			);
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

function undoThirdStationTaken(employee: ScheduleGeneratorEmployee) {
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

function assignFourthShift(
	schedule: dailySchedule,
	stations: Station[],
	employees: ScheduleGeneratorEmployee[],
	timesFailed = 0
): dailySchedule | 0 {
	if (timesFailed > 10) return 0;
	const completeSchedule = _.cloneDeep(schedule);
	const [kinezaStation, fizykoStation, masazStation] = nameStations(stations);
	let nextStation: Station;
	let tableIndex: number;
	//Filter those who has been working on kineza twice
	employees
		.filter(
			(employee) =>
				employee.stationsTaken[0] === kinezaStation &&
				employee.stationsTaken[1] === kinezaStation
		)
		.forEach((employee) => {
			while (_.isUndefined(tableIndex)) {
				nextStation = _.sample([fizykoStation, masazStation]);
				tableIndex = findFirstEmpty(
					completeSchedule[nextStation.name],
					WORKSTAGESPANS.FOURTH
				);
			}
			completeSchedule[nextStation.name][tableIndex] = employee.employee;
			tableIndex = undefined;
		});
	//Filter those who has been working on fizyko twice
	employees
		.filter(
			(employee) =>
				employee.stationsTaken[0] === fizykoStation &&
				employee.stationsTaken[1] === fizykoStation
		)
		.forEach((employee) => {
			while (_.isUndefined(tableIndex)) {
				nextStation = _.sample([kinezaStation, masazStation]);
				tableIndex = findFirstEmpty(
					completeSchedule[nextStation.name],
					WORKSTAGESPANS.FOURTH
				);
			}
			completeSchedule[nextStation.name][tableIndex] = employee.employee;
			tableIndex = undefined;
		});
	//Filter those who has been working on masaz
	employees
		.filter((employee) => employee.stationsTaken.includes(masazStation))
		.forEach((employee) => {
			while (_.isUndefined(tableIndex)) {
				nextStation = _.sample([kinezaStation, fizykoStation]);
				tableIndex = findFirstEmpty(
					completeSchedule[nextStation.name],
					WORKSTAGESPANS.FOURTH
				);
			}
			completeSchedule[nextStation.name][tableIndex] = employee.employee;
			tableIndex = undefined;
		});

	employees
		.filter(
			(employee) =>
				employee.stationsTaken[0] !== employee.stationsTaken[1] &&
				!employee.stationsTaken.includes(masazStation)
		)
		.forEach((employee) => {
			while (_.isUndefined(tableIndex)) {
				nextStation = _.sample([kinezaStation, fizykoStation, masazStation]);
				tableIndex = findFirstEmpty(
					completeSchedule[nextStation.name],
					WORKSTAGESPANS.FOURTH
				);
			}
			completeSchedule[nextStation.name][tableIndex] = employee.employee;
			tableIndex = undefined;
		});
	//Correct shedule should have both kineza cells and massage cell filled. Othervise repeat
	return completeSchedule[kinezaStation.name][WORKSTAGESPANS.FOURTH[0]] &&
		completeSchedule[kinezaStation.name][WORKSTAGESPANS.FOURTH[1]] &&
		completeSchedule[masazStation.name][WORKSTAGESPANS.FOURTH[0]]
		? completeSchedule
		: assignFourthShift(schedule, stations, employees, ++timesFailed);
}

function nameStations(stations: Station[]): Station[] {
	return [
		stations.find((station) => station.name === 'KINEZA'),
		stations.find((station) => station.name === 'FIZYKO'),
		stations.find((station) => station.name === 'MASAZ'),
		stations.find((station) => station.name === 'WIZYTY'),
	];
}
