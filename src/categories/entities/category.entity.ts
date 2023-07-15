import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@prisma/client';
import { GroupEntity } from 'src/groups/entities';
import { UserEntity } from 'src/users/entities';

export class CategoryEntity implements Category {
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

  @ApiProperty({ required: false, type: UserEntity })
  createdUser?: UserEntity;

  @ApiProperty({ required: false, type: GroupEntity, isArray: true })
  groups?: GroupEntity[];

  constructor(partial: Partial<CategoryEntity>) {
    if (!partial) {
      console.log('category entity is null');
      return null;
    }

    Object.assign(this, partial);

    if (partial.createdUser) {
      this.createdUser = new UserEntity(partial.createdUser);
    }

    if (partial.groups) {
      this.groups = partial.groups.map((group) => new GroupEntity(group));
    }
  }
}
