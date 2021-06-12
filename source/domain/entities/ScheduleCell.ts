import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Employee } from './Employee';
import { Station } from './Station';

@Entity()
export class ScheduleCell {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'date' })
	public date: string;

	@Column()
	public orderInTable: number;

	@ManyToOne(() => Station, (station) => station.scheduleTables, {
		nullable: false,
	})
	public station: Station;

	@ManyToOne(() => Employee, (employee) => employee.scheduleCells)
	public employeeAtCell: Employee;

	constructor(
		date: string,
		station: Station,
		order: number,
		employeeAtCell: Employee = null
	) {
		this.date = date;
		this.orderInTable = order;
		this.station = station;
		this.employeeAtCell = employeeAtCell;
	}
}
