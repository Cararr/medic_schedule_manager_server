import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { WorkStage } from './WorkStage';

@Entity({ name: 'work_stage_span' })
export class WorkStageSpan {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public from: string;

	@Column()
	public to: string;

	@OneToMany(() => WorkStage, (workStage) => workStage.work_stage_span)
	public work_stages: WorkStage[];

	constructor(from: string, to: string) {
		this.from = from;
		this.to = to;
	}
}
