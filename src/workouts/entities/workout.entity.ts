import { ApiProperty } from '@nestjs/swagger';
import { Workout } from '@prisma/client';
import { ExerciseEntity } from 'src/exercises/entities';
import { UserEntity } from 'src/users/entities';

export class WorkoutEntity implements Workout {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date: Date;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty()
  userId: number;

  @ApiProperty({ type: UserEntity })
  user: UserEntity;

  @ApiProperty({ required: false, type: ExerciseEntity, isArray: true })
  exercices?: ExerciseEntity[];

  constructor(partial: Partial<WorkoutEntity>) {
    if (!partial) {
      return null;
    }

    Object.assign(this, partial);

    if (partial.user) {
      this.user = new UserEntity(partial.user);
    }

    if (partial.exercices) {
      this.exercices = partial.exercices.map(
        (exercice) => new ExerciseEntity(exercice),
      );
    }
  }
}
