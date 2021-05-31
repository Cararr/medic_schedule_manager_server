import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { HomeRehabilitation } from './HomeRehabilitation';
import { Vacation } from './Vacation';
import { ScheduleCell } from './ScheduleCell';
import { employeeRole } from '../../../typeDefs/types';

@Entity()
export class Employee {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ length: 50 })
	public firstName: string;

	@Column({ length: 100, unique: true })
	public lastName: string;

	@Column({ select: false })
	public password: string;

	@Column({
		type: 'enum',
		enum: employeeRole,
		default: employeeRole.EMPLOYEE,
	})
	public role: employeeRole;

	@OneToMany(
		() => HomeRehabilitation,
		(homeRehabilitation) => homeRehabilitation.employee
	)
	public homeRehabilitaitons: HomeRehabilitation[];

	@OneToMany(() => Vacation, (vacation) => vacation.employee)
	public vacations: Vacation[];

	@OneToMany(() => ScheduleCell, (scheduleCell) => scheduleCell.employeeAtCell)
	public scheduleCells: ScheduleCell[];

	constructor(firstName: string, lastName: string, password: string) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.password = password;
	}
}
