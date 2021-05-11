import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ScheduleTable } from './ScheduleTable';

@Entity()
export class Station {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public name: string;

	@Column()
	public numberOfCellsInTable: number;

	@OneToMany(() => ScheduleTable, (scheduleTable) => scheduleTable.station)
	public scheduleTables: ScheduleTable[];

	constructor(name: string, numberOfCellsInTable: number) {
		this.name = name;
		this.numberOfCellsInTable = numberOfCellsInTable;
	}
}
