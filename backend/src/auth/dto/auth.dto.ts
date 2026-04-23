import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string | undefined;

  @IsNotEmpty()
  @IsString()
  password: string | undefined;
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string | undefined;

  @IsEmail()
  email: string | undefined;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string | undefined;

  @IsOptional()
  @IsString()
  role?: string;
}
