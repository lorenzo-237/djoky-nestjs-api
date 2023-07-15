import { ApiProperty } from '@nestjs/swagger';

export class TimestampEntity {
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  isDeleted: boolean;
}
