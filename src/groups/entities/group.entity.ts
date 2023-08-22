import { ApiProperty } from '@nestjs/swagger';
import { Group } from '@prisma/client';

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

  @ApiProperty()
  createdUserId: number;

  constructor(partial: Partial<GroupEntity>) {
    if (!partial) {
      return null;
    }

    Object.assign(this, partial);
  }
}
