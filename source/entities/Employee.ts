import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { HomeRehabilitation } from './HomeRehabilitation';
import { ScheduleCell } from './ScheduleCell';
import { Vacation } from './Vacation';

@Entity()
export class Employee {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ length: 50 })
	public first_name: string;

	@Column({ length: 100 })
	public last_name: string;

	@OneToMany(() => ScheduleCell, (scheduleCell) => scheduleCell.employee)
	public schedule_cells: ScheduleCell[];

	@OneToMany(
		() => HomeRehabilitation,
		(homeRehabilitation) => homeRehabilitation.employee
	)
	public home_rehabilitations: HomeRehabilitation[];

	@OneToMany(() => Vacation, (vacation) => vacation.employee)
	public vacations: Vacation[];

	constructor(firstName: string, lastName: string) {
		this.first_name = firstName;
		this.last_name = lastName;
	}
}
