import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditTaskDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;
  @IsNumber()
  @IsOptional()
  boardId?: number;
}
