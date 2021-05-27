import { ScheduleCell } from '../entities/ScheduleCell';
import { Employee } from '../entities/Employee';
import { Station } from '../entities/Station';
import { dailySchedule } from '../../../typeDefs/types';

export const scheduleGenerator = (
	employeesList: Employee[],
	stations: Station[]
): { [station: string]: (Employee | null)[] } => {
	const schedule: { [station: string]: (Employee | null)[] } = {};
	const employees = [...employeesList];
	const employeesCounter: Map<Employee, { counter: number }> = new Map();
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
	}
	console.log(employeesCounter);

	return schedule;
};
