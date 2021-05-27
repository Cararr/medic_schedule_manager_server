import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { HomeRehabilitation } from './HomeRehabilitation';
import { Vacation } from './Vacation';
import { ScheduleCell } from './ScheduleCell';

@Entity()
export class Employee {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ length: 50 })
	public firstName: string;

	@Column({ length: 100 })
	public lastName: string;

	@OneToMany(
		() => HomeRehabilitation,
		(homeRehabilitation) => homeRehabilitation.employee
	)
	public homeRehabilitaitons: HomeRehabilitation[];

	@OneToMany(() => Vacation, (vacation) => vacation.employee)
	public vacations: Vacation[];

	@OneToMany(() => ScheduleCell, (scheduleCell) => scheduleCell.cellValue)
	public scheduleCells: ScheduleCell[];

	constructor(firstName: string, lastName: string) {
		this.firstName = firstName;
		this.lastName = lastName;
	}
}
