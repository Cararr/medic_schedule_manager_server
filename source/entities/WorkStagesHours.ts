import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { WorkStage } from './WorkStage';

@Entity()
export class WorkStagesHours {
	@PrimaryGeneratedColumn()
	public WorkStagesHoursId: number;

	@Column()
	public From: string;

	@Column()
	public To: string;

	@OneToMany(() => WorkStage, (workStage) => workStage.WorkStagesHours)
	public WorkStages: WorkStage[];

	constructor(From: string, To: string) {
		this.From = From;
		this.To = To;
	}
}
