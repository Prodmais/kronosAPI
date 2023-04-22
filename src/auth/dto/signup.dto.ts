import {
  IsEmail,
  IsString,
  Matches,
  MinLength,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @MaxLength(11)
  @MinLength(11)
  @IsNotEmpty()
  @Matches(/^(?=.*[0-9]).{11}$/, {
    message: 'Phone must be a valid phone number',
  })
  phone: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6,}$/, {
    message:
      'Password must have minimum 6 characters length, letters in Upper Case, letters in Lower Case, numerals and Special Character',
  })
  password: string;
}
