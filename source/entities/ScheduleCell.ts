import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Employee } from './Employee';
import { WorkStage } from './WorkStage';

@Entity({ name: 'schedule_cell' })
export class ScheduleCell {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public date: string;

	@ManyToOne(() => WorkStage, (workStage) => workStage.schedule_cells)
	public work_stage: WorkStage;

	@ManyToOne(() => Employee, (employee) => employee.schedule_cells)
	public employee: Employee;

	constructor(date: string, workStage: WorkStage, employee: Employee) {
		this.date = date;
		this.work_stage = workStage;
		this.employee = employee;
	}
}
