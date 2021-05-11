import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Employee } from './Employee';
import { Station } from './Station';

@Entity()
export class ScheduleTable {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public date: string;

	@ManyToOne(() => Station, (station) => station.scheduleTables, {
		nullable: false,
	})
	public station: Station;

	@ManyToOne(() => Employee)
	public cell1Employee: Employee;
	@ManyToOne(() => Employee)
	public cell2Employee: Employee;
	@ManyToOne(() => Employee)
	public cell3Employee: Employee;
	@ManyToOne(() => Employee)
	public cell4Employee: Employee;
	@ManyToOne(() => Employee)
	public cell5Employee: Employee;
	@ManyToOne(() => Employee)
	public cell6Employee: Employee;
	@ManyToOne(() => Employee)
	public cell7Employee: Employee;
	@ManyToOne(() => Employee)
	public cell8Employee: Employee;
	@ManyToOne(() => Employee)
	public cell9Employee: Employee;
	@ManyToOne(() => Employee)
	public cell10Employee: Employee;
	@ManyToOne(() => Employee)
	public cell11Employee: Employee;
	@ManyToOne(() => Employee)
	public cell12Employee: Employee;

	constructor(
		date: string,
		station: Station,
		cell1Value: Employee = null,
		cell2Value: Employee = null,
		cell3Value: Employee = null,
		cell4Value: Employee = null,
		cell5Value: Employee = null,
		cell6Value: Employee = null,
		cell7Value: Employee = null,
		cell8Value: Employee = null,
		cell9Value: Employee = null,
		cell10Value: Employee = null,
		cell11Value: Employee = null,
		cell12Value: Employee = null
	) {
		this.date = date;
		this.station = station;
		this.cell1Employee = cell1Value;
		this.cell2Employee = cell2Value;
		this.cell3Employee = cell3Value;
		this.cell4Employee = cell4Value;
		this.cell5Employee = cell5Value;
		this.cell6Employee = cell6Value;
		this.cell7Employee = cell7Value;
		this.cell8Employee = cell8Value;
		this.cell9Employee = cell9Value;
		this.cell10Employee = cell10Value;
		this.cell11Employee = cell11Value;
		this.cell12Employee = cell12Value;
	}
}
