import { ApiProperty } from '@nestjs/swagger';
import { Exercise } from '@prisma/client';
import { GroupEntity } from 'src/groups/entities';
import { UserEntity } from 'src/users/entities';

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

  @ApiProperty({ type: () => GroupEntity })
  group: GroupEntity;

  @ApiProperty()
  createdUserId: number;

  @ApiProperty({ required: false, type: UserEntity })
  createdUser?: UserEntity;

  @ApiProperty()
  timed: boolean;

  constructor(partial: Partial<ExerciseEntity>) {
    if (!partial) {
      return null;
    }

    Object.assign(this, partial);

    if (partial.createdUser) {
      this.createdUser = new UserEntity(partial.createdUser);
    }
  }
}
