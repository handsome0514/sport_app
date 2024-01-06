import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

import { UserDto } from '../../user/dtos/user.dto';

export class RegisterDto {
  @ApiProperty({
    description: 'Email',
    type: 'string',
    example: 'guess@gmail.com',
  })
  @IsEmail()
  readonly user_email: string;

  @ApiProperty({
    description: 'Password',
    type: 'string',
    example: '12345678',
  })
  @IsString()
  readonly password: string;
}

export class LogInDto extends RegisterDto {}

export class RefreshResponseDto {
  @ApiProperty({
    description: 'Access JWT token',
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDY1ZTgwYjgwNDNiZjlhZjEwMDRhZmQiLCJyb2xlcyI6WyJQbGF5ZXIiXSwiaWF0IjoxNjg0NDAwMTQ0LCJleHAiOjE2ODQ0MDEwNDR9.ENoQEB1NsWBHwF9K4DQB8ZqtAn56sQaw9sSMWaXgLtc',
  })
  readonly accessToken: string;

  @ApiProperty({
    description: 'User DTO',
    type: UserDto,
    example: UserDto,
  })
  readonly user: UserDto;
}

export class LoginResponseDto extends RefreshResponseDto {}

export class UpdateOwnUserDto {
  @ApiProperty({
    description: 'Name',
    type: 'string',
    example: 'Jake Hill',
  })
  @IsString()
  @MaxLength(30)
  @IsOptional()
  readonly name: string;

  @ApiProperty({
    description: 'Email',
    type: 'string',
    example: 'some@mail.com',
    uniqueItems: true,
  })
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @ApiProperty({
    description: 'Phone number',
    type: 'string',
    example: '+380980999213',
    uniqueItems: true,
  })
  @IsPhoneNumber()
  @IsOptional()
  readonly phone: string;

  @ApiProperty({
    description: 'Nickname',
    type: 'string',
    example: 'jakeH',
    uniqueItems: true,
  })
  @IsString()
  @MaxLength(15)
  @IsOptional()
  readonly nickname: string;
}

export class UserActivationResponseDto {
  @ApiProperty({
    description: 'Message',
    type: String,
    default: 'Account activated',
  })
  readonly message: 'Account activated';
}

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Profile email',
    type: String,
    example: 'some@mail.com',
  })
  readonly email: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty({
    description: 'Message',
    type: String,
    default: 'Check your email',
  })
  readonly message: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'New password',
    type: String,
    example: 'not-qeurty',
  })
  readonly password: string;

  @ApiProperty({
    description: 'User ID',
    type: String,
    example: '64679553d9be39eeab79d341',
  })
  readonly userId: string;
}

export class ResetPasswordResponseDto {
  @ApiProperty({
    description: 'Message',
    type: String,
    default: 'Success',
  })
  readonly message: string;
}

export class UpdateOwnUserResponseDto extends UserDto {}

export class GetUserDataResponseDto extends UserDto {
  @ApiProperty({
    description: 'ATP standing number',
    type: Number,
    default: 0,
    example: 1123,
  })
  atpStanding: number;

  @ApiProperty({
    description: 'Played games',
    type: Number,
    default: 0,
    example: 251,
  })
  playedGames: number;

  @ApiProperty({
    description: 'Number of wins',
    type: Number,
    default: 0,
    example: 112,
  })
  wins: number;

  @ApiProperty({
    description: 'Number of trophies',
    type: Number,
    default: 0,
    example: 21,
  })
  trophies: number;

  @ApiProperty({
    description: 'Player name',
    type: String,
    example: 'Joshua',
  })
  name: string;
}
