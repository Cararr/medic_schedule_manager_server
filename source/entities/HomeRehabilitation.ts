import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Employee } from './Employee';

@Entity()
export class HomeRehabilitation {
	@PrimaryGeneratedColumn()
	public id: number;

	@ManyToOne(() => Employee, (employee) => employee.homeRehabilitaitons, {
		nullable: false,
	})
	public employee: Employee;

	@Column({ length: 250 })
	public patient: string;

	@Column()
	public date: string;

	@Column()
	public startTime: string;

	constructor(
		employee: Employee,
		patient: string,
		date: string,
		startTime: string
	) {
		this.employee = employee;
		this.patient = patient;
		this.date = date;
		this.startTime = startTime;
	}
}
