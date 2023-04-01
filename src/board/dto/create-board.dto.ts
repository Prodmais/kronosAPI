import { IsEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @IsEmpty()
  name: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsNumber()
  projectId: number;
}
