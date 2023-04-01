import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  name: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsNumber()
  projectId: number;
}
