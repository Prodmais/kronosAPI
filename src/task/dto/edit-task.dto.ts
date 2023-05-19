import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditTaskDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsDateString()
  @IsOptional()
  endDate?: Date;
  @IsNumber()
  @IsOptional()
  boardId?: number;
  @IsNumber()
  @IsOptional()
  ownerId?: number;
}
