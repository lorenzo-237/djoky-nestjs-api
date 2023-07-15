import { ApiProperty } from '@nestjs/swagger';
import { Group } from '@prisma/client';
import { CategoryEntity } from 'src/categories/entities';
import { ExerciseEntity } from 'src/exercises/entities';
import { UserEntity } from 'src/users/entities';

export class GroupEntity implements Group {
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
  categoryId: number;

  @ApiProperty({ required: false, type: CategoryEntity })
  category?: CategoryEntity;

  @ApiProperty()
  createdUserId: number;

  @ApiProperty({ required: false, type: UserEntity })
  createdUser?: UserEntity;

  @ApiProperty({ required: false, type: ExerciseEntity, isArray: true })
  exercices?: ExerciseEntity[];

  constructor(partial: Partial<GroupEntity>) {
    if (!partial) {
      console.log('group entity is null');
      return null;
    }

    Object.assign(this, partial);

    if (partial.createdUser) {
      this.createdUser = new UserEntity(partial.createdUser);
    }

    if (partial.exercices) {
      this.exercices = partial.exercices.map(
        (exercice) => new ExerciseEntity(exercice),
      );
    }
  }
}
