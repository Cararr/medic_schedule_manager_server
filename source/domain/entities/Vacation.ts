import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Employee } from './Employee';

@Entity()
export class Vacation {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'date' })
	public from: string;

	@Column({ type: 'date' })
	public to: string;

	@ManyToOne(() => Employee, (employee) => employee.vacations, {
		nullable: false,
	})
	public employee: Employee;

	constructor(from: string, to: string, employee: Employee) {
		this.from = from;
		this.to = to;
		this.employee = employee;
	}
}
