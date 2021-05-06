import { employee } from '../typeDefs/types';

export function returnQueryCellsByStationName(station: string): string {
	switch (station) {
		case 'kineza':
			return 'CELL_1, CELL_2, CELL_3, CELL_4, CELL_5, CELL_6, CELL_7, CELL_8, CELL_9, CELL_10';
		case 'fizyko':
			return 'CELL_1, CELL_2, CELL_3, CELL_4, CELL_5, CELL_6, CELL_7, CELL_8';
		case 'masaz':
			return 'CELL_1, CELL_2, CELL_3, CELL_4';
		default:
			return '';
	}
}
export function convertArrayOfNamesToIds(
	employees: employee[],
	arrayOfNames: string[]
): (number | null)[] {
	return arrayOfNames.map((fullName: string) => {
		const employeeName = fullName.split(' ')[0];
		const employeeLastName = fullName.split(' ')[1];
		const employeeFound = employees.find((emp: employee) => {
			return emp.name === employeeName && emp.last_name === employeeLastName;
		});
		return employeeFound ? employeeFound.id : null;
	});
}
