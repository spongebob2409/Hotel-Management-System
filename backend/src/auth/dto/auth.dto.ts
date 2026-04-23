import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  role?: string;
}
