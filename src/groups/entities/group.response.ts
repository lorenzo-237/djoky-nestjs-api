import { ApiProperty } from '@nestjs/swagger';
import { ExerciseModel } from 'src/exercises/entities';

export class GroupCategory {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}

export class GroupRow {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isPending: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdUserId: number;

  @ApiProperty({ type: GroupCategory })
  category: GroupCategory;

  @ApiProperty({ type: ExerciseModel, isArray: true })
  exercises: ExerciseModel[];
}

export class GroupResponse {
  @ApiProperty()
  count: number;
  @ApiProperty({ type: GroupRow, isArray: true })
  rows: GroupRow[];
}
