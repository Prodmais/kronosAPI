import { IsNumber, IsDateString, IsString } from 'class-validator';

export class CreateSprintDto {
  @IsString()
  title: string;
  @IsDateString()
  startDate: Date;
  @IsDateString()
  endDate: Date;
  @IsNumber()
  projectId: number;
}
