import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Employee } from './Employee';
import { Station } from './Station';

@Entity()
export class ScheduleCell {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public date: string;

	@Column()
	public orderInTable: number;

	@ManyToOne(() => Station, (station) => station.scheduleTables, {
		nullable: false,
	})
	public station: Station;

	@ManyToOne(() => Employee, (employee) => employee.scheduleCells)
	public cellValue: Employee;

	constructor(
		date: string,
		station: Station,
		order: number,
		cellValue: Employee = null
	) {
		this.date = date;
		this.orderInTable = order;
		this.station = station;
		this.cellValue = cellValue;
	}
}
