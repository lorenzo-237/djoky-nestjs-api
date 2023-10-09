import { ApiProperty } from '@nestjs/swagger';
import { WorkoutEntity } from './workout.entity';

export class WorkoutResponse {
  @ApiProperty()
  page: number;
  @ApiProperty()
  pageSize: number;
  @ApiProperty()
  totalPage: number;
  @ApiProperty()
  count: number;
  @ApiProperty({ type: WorkoutEntity, isArray: true })
  rows: WorkoutEntity[];
}
