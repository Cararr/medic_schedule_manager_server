import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WorkStageSpan {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public from: string;

	@Column()
	public to: string;

	constructor(from: string, to: string) {
		this.from = from;
		this.to = to;
	}
}
