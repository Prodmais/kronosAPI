import { IsString } from 'class-validator';

export class ResetPasswordUserDto {
  @IsString()
  email: string;
}
