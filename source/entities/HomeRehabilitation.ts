import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Employee } from './Employee';

@Entity()
export class HomeRehabilitation {
	@PrimaryGeneratedColumn()
	public HomeRehabilitationId: number;

	@ManyToOne(() => Employee, (employee) => employee.HomeRehabilitations)
	public Employee: Employee;

	@Column({ length: 250 })
	public Patient: string;

	@Column()
	public Date: string;

	@Column()
	public StartTime: string;

	constructor(
		Employee: Employee,
		Patient: string,
		Date: string,
		StartTime: string
	) {
		this.Employee = Employee;
		this.Patient = Patient;
		this.Date = Date;
		this.StartTime = StartTime;
	}
}
