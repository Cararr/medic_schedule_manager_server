import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Employee } from './Employee';

@Entity()
export class Vacation {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public date: string;

	@ManyToOne(() => Employee, (employee) => employee.vacations, {
		nullable: false,
	})
	public employee: Employee;

	constructor(date: string, employee: Employee) {
		this.date = date;
		this.employee = employee;
	}
}
