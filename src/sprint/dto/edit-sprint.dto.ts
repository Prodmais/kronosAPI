import { IsDateString, IsOptional, IsString } from 'class-validator';

export class EditSprintDto {
  @IsString()
  @IsOptional()
  title: string;
  @IsDateString()
  @IsOptional()
  startDate: Date;
  @IsDateString()
  @IsOptional()
  endDate: Date;
}
