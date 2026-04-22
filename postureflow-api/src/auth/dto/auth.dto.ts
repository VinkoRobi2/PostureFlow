import { Locale } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  firstName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  lastName?: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @IsOptional()
  @IsEnum(Locale)
  locale?: Locale;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @IsOptional()
  @IsEnum(Locale)
  locale?: Locale;
}

export class GoogleLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(60)
  firstName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  googleSubject?: string;

  @IsOptional()
  @IsEnum(Locale)
  locale?: Locale;
}

export class VerifyEmailDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(4)
  @MaxLength(12)
  code!: string;

  @IsOptional()
  @IsEnum(Locale)
  locale?: Locale;
}

export class ResendVerificationDto {
  @IsEmail()
  email!: string;
}

export class RestoreSessionDto {
  @IsString()
  @MinLength(16)
  sessionToken!: string;

  @IsOptional()
  @IsEnum(Locale)
  locale?: Locale;
}

export class LogoutDto {
  @IsString()
  @MinLength(16)
  sessionToken!: string;
}
