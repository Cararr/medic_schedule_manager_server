import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Employee } from './Employee';
import { WorkStage } from './WorkStage';

@Entity()
export class ScheduleTableCell {
	@PrimaryGeneratedColumn()
	public ScheduleTableCellId: number;

	@Column()
	public Date: string;

	@ManyToOne(() => WorkStage, (workStage) => workStage.ScheduleTableCells)
	public WorkStage: WorkStage;

	@ManyToOne(() => Employee, (employee) => employee.ScheduleTableCells)
	public Employee: Employee;

	constructor(Date: string, WorkStage: WorkStage, Employee: Employee) {
		this.Date = Date;
		this.WorkStage = WorkStage;
		this.Employee = Employee;
	}
}
