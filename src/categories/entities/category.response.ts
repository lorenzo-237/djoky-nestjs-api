import { ApiProperty } from '@nestjs/swagger';

export class CategoryRow {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdUserId: number;

  @ApiProperty()
  isPending: boolean;
}

export class CategoryResponse {
  @ApiProperty()
  count: number;
  @ApiProperty({ type: CategoryRow, isArray: true })
  rows: CategoryRow[];
}
