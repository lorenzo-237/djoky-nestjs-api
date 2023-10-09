import { IsDateString, IsOptional } from 'class-validator';

export class WorkoutFilterDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsOptional()
  page = '1';

  @IsOptional()
  pageSize = '10';
}

// startDate=2023-01-01&endDate=2023-12-31
