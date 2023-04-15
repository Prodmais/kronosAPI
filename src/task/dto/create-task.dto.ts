import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsDateString()
  @IsOptional()
  endDate: Date;
  @IsNumber()
  boardId: number;
}
