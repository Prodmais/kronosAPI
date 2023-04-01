import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class EditBoardDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsBoolean()
  @IsOptional()
  isMobile?: boolean;
  @IsBoolean()
  @IsOptional()
  isSprint?: boolean;
}
