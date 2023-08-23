import { ApiProperty } from '@nestjs/swagger';
import { WorkoutEntity } from './workout.entity';

export class WorkoutResponse {
  @ApiProperty()
  count: number;
  @ApiProperty({ type: WorkoutEntity, isArray: true })
  rows: WorkoutEntity[];
}
