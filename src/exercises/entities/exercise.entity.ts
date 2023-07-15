import { ApiProperty } from '@nestjs/swagger';
import { Exercise } from '@prisma/client';
import { GroupEntity } from 'src/groups/entities';
import { UserEntity } from 'src/users/entities';
import { WorkoutEntity } from 'src/workouts/entities';

export class ExerciseEntity implements Exercise {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty()
  isPending: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  groupId: number;

  @ApiProperty({ type: GroupEntity })
  group: GroupEntity;

  @ApiProperty()
  createdUserId: number;

  @ApiProperty({ required: false, type: UserEntity })
  createdUser?: UserEntity;

  @ApiProperty({ required: false, type: WorkoutEntity, isArray: true })
  workouts?: WorkoutEntity[];

  constructor(partial: Partial<ExerciseEntity>) {
    if (!partial) {
      console.log('exercice entity is null');
      return null;
    }

    Object.assign(this, partial);

    if (partial.createdUser) {
      this.createdUser = new UserEntity(partial.createdUser);
    }

    if (partial.workouts) {
      this.workouts = partial.workouts.map(
        (workout) => new WorkoutEntity(workout),
      );
    }
  }
}
