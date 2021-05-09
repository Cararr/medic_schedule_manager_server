import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { WorkStageSpan } from './WorkStageSpan';
import { ScheduleCell } from './ScheduleCell';

@Entity({ name: 'work_stage' })
export class WorkStage {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public station_name: string;

	@ManyToOne(
		() => WorkStageSpan,
		(workStageHours) => workStageHours.work_stages
	)
	public work_stage_span: WorkStageSpan;

	@Column()
	public employee_slots: number;

	@OneToMany(
		() => ScheduleCell,
		(scheduleTableCell) => scheduleTableCell.work_stage
	)
	public schedule_cells: ScheduleCell[];

	constructor(
		stationName: string,
		workStagesHours: WorkStageSpan,
		employeeSlots: number
	) {
		this.station_name = stationName;
		this.work_stage_span = workStagesHours;
		this.employee_slots = employeeSlots;
	}
}
