import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { WorkStagesHours } from './WorkStagesHours';
import { ScheduleTableCell } from './ScheduleTableCell';

@Entity()
export class WorkStage {
	@PrimaryGeneratedColumn()
	public WorkStageId: number;

	@Column()
	public StationName: string;

	@ManyToOne(
		() => WorkStagesHours,
		(workStageHours) => workStageHours.WorkStages
	)
	public WorkStagesHours: WorkStagesHours;

	@Column()
	public EmployeeSlots: number;

	@OneToMany(
		() => ScheduleTableCell,
		(scheduleTableCell) => scheduleTableCell.WorkStage
	)
	public ScheduleTableCells: ScheduleTableCell[];

	constructor(
		StationName: string,
		WorkStagesHours: WorkStagesHours,
		EmployeeSlots: number
	) {
		this.StationName = StationName;
		this.WorkStagesHours = WorkStagesHours;
		this.EmployeeSlots = EmployeeSlots;
	}
}
