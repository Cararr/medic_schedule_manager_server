import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'date', unique: true })
	public date: string;

	@Column({ length: 450 })
	public content: string;

	constructor(date: string, content: string) {
		this.date = date;
		this.content = content;
	}
}
