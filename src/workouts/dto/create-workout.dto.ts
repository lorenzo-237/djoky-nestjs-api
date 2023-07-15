import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkoutDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;
}
