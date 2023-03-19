import {
  IsString,
  Matches,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  lastName?: string;
  @IsString()
  @MaxLength(11)
  @MinLength(11)
  @Matches(/^(?=.*[0-9]).{11}$/, {
    message: 'Phone must be a valid phone number',
  })
  @IsOptional()
  phone?: string;
}
