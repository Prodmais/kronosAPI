import { IsString } from 'class-validator';

export class InviteProjectDto {
  @IsString()
  email: string;
}
