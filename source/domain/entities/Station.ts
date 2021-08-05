import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ScheduleCell } from './ScheduleCell';
import { StationName } from '../../../typeDefs/types';

@Entity()
export class Station {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({
		type: 'enum',
		enum: StationName,
	})
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
