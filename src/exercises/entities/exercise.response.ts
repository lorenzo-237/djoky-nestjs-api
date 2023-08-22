import { ApiProperty } from '@nestjs/swagger';
import { GroupCategory } from 'src/groups/entities';

export class ExerciseGroup {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: GroupCategory })
  category: GroupCategory;
}

export class ExerciseRow {
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

  @ApiProperty({ type: ExerciseGroup })
  group: ExerciseGroup;
}

export class ExerciseResponse {
  @ApiProperty()
  count: number;
  @ApiProperty({ type: ExerciseRow, isArray: true })
  rows: ExerciseRow[];
}
