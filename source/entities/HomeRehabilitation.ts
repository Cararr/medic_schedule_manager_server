import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Employee } from './Employee';

@Entity({ name: 'home_rehabilitaiton' })
export class HomeRehabilitation {
	@PrimaryGeneratedColumn()
	public id: number;

	@ManyToOne(() => Employee, (employee) => employee.home_rehabilitations)
	public employee: Employee;

	@Column({ length: 250 })
	public patient: string;

	@Column()
	public date: string;

	@Column()
	public start_time: string;

	constructor(
		employee: Employee,
		patient: string,
		date: string,
		startTime: string
	) {
		this.employee = employee;
		this.patient = patient;
		this.date = date;
		this.start_time = startTime;
	}
}
