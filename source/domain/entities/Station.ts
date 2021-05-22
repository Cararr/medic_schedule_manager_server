import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ScheduleCell } from './ScheduleCell';

@Entity()
export class Station {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public name: string;

	@Column()
	public numberOfCellsInTable: number;

	@OneToMany(() => ScheduleCell, (scheduleTable) => scheduleTable.station)
	public scheduleTables: ScheduleCell[];

	constructor(name: string, numberOfCellsInTable: number) {
		this.name = name;
		this.numberOfCellsInTable = numberOfCellsInTable;
	}
}
