import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { HomeRehabilitation } from './HomeRehabilitation';
import { ScheduleTableCell } from './ScheduleTableCell';

@Entity()
export class Employee {
	@PrimaryGeneratedColumn('uuid')
	public EmployeeId: string;

	@Column({ length: 50 })
	public FirstName: string;

	@Column({ length: 100 })
	public LastName: string;

	@OneToMany(
		() => ScheduleTableCell,
		(scheduleTableCell) => scheduleTableCell.Employee
	)
	public ScheduleTableCells: ScheduleTableCell[];

	@OneToMany(
		() => HomeRehabilitation,
		(homeRehabilitation) => homeRehabilitation.Employee
	)
	public HomeRehabilitations: HomeRehabilitation[];

	constructor(FirstName: string, LastName: string) {
		this.FirstName = FirstName;
		this.LastName = LastName;
	}
}
