import { ApiProperty, PartialType } from '@nestjs/swagger';
import { GroupCategory } from 'src/groups/entities';

export class ExerciseGroup {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: GroupCategory })
  category: GroupCategory;
}

export class ExerciseModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdUserId: number;

  @ApiProperty()
  isPending: boolean;

  @ApiProperty()
  timed: boolean;
}

export class ExerciseRow extends PartialType(ExerciseModel) {
  @ApiProperty({ type: ExerciseGroup })
  group: ExerciseGroup;
}

export class ExerciseResponse {
  @ApiProperty()
  count: number;
  @ApiProperty({ type: ExerciseRow, isArray: true })
  rows: ExerciseRow[];
}
