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
	/* let test: GeneratorEmployee[] = [];
	
	employeesList.forEach((element) => {
		test.push(new GeneratorEmployee(element, 'evening '));
	});

	test = _.shuffle(test);
	test.forEach((element,index) => {
		if(index<=3)
	});
	console.log(test); */
	const employees: GeneratorEmployee[] = [];
	_.shuffle(employeesList).forEach((employee, index) => {
		const shiftType: shift = index < 5 ? shift.MORNING : shift.EVENING;
		employees.push(new GeneratorEmployee(employee, shiftType));
	});

	const schedule: dailySchedule = {};
	for (const station of stations) {
		schedule[station.name] = new Array(station.numberOfCellsInTable).fill(null);
	}

	employees.forEach((employee, index) => {
		const station = stations[index % 3];
		const tableIndex = findFirstEmpty(
			schedule[station.name],
			WORKSTAGESPANS.FIRST
		);
		employee.stationsOccupied.push(station);
		schedule[station.name][tableIndex] = employee.employee;
	});

	employees.forEach((employee) => {
		const previousStation = _.last(employee.stationsOccupied);

		let station = returnDifferentStation(stations, previousStation);
		let tableIndex = findFirstEmpty(
			schedule[station.name],
			WORKSTAGESPANS.SECOND
		);

		while (tableIndex === undefined) {
			station = returnDifferentStation(stations, previousStation);
			tableIndex = findFirstEmpty(
				schedule[station.name],
				WORKSTAGESPANS.SECOND
			);
			console.log(station);
		}

		employee.stationsOccupied.push(station);
		schedule[station.name][tableIndex] = employee.employee;
	});

	employees.forEach((employee) => {
		const previousStation = _.last(employee.stationsOccupied);
		const station = returnDifferentStation(stations, previousStation);

		const tableIndex = findFirstEmpty(
			schedule[station.name],
			WORKSTAGESPANS.THIRD
		);
		employee.stationsOccupied.push(station);
		schedule[station.name][tableIndex] = employee.employee;
	});

	employees.forEach((employee) => {
		if (employee.shift === 'EVENING') {
			const previousStation = _.last(employee.stationsOccupied);
			const station = returnDifferentStation(stations, previousStation);

			const tableIndex = findFirstEmpty(
				schedule[station.name],
				WORKSTAGESPANS.FOURTH
			);
			employee.stationsOccupied.push(station);
			schedule[station.name][tableIndex] = employee.employee;
		}
	});

	// console.log(employees);

	/* const employeesCounter: Map<Employee, { counter: number }> = new Map();
	for (const employee of employees) {
		employeesCounter.set(employee, { counter: 0 });
	}

	for (const station of stations) {
		schedule[station.name] = new Array(station.numberOfCellsInTable).fill(null);

		schedule[station.name].forEach((cell, index, array) => {
			const randomEmployee =
				employees[Math.floor(Math.random() * employees.length)];
			employeesCounter.get(randomEmployee).counter++;

			if (employeesCounter.get(randomEmployee).counter === 3)
				employees.splice(
					employees.findIndex((emp) => emp.id === randomEmployee.id),
					1
				);
			array[index] = randomEmployee;
		});
	} */

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
	previousStation: Station
): Station {
	if (previousStation.name !== 'KINEZA') return stations[0];
	//ZRÓ TAK, ŻE ZWRÓCI KINEZĘ JEŻELI BĘDĄ TAM MIEJSCA
	const randomIndex = _.random(0, 2);
	const newStation = stations[randomIndex];

	return newStation.name !== previousStation.name
		? newStation
		: returnDifferentStation(stations, previousStation);
}
