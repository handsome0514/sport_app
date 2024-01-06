import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { PaginationDto } from '../../shared/dto/shared.dto';
import { UserDto } from '../../user/dtos/user.dto';
import { UserRoles } from '../../user/schemas/user.schema';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email',
    type: 'string',
    uniqueItems: true,
    example: 'example@mail.com',
  })
  @IsEmail()
  readonly user_email: string;

  @ApiProperty({
    description: 'Password',
    type: 'string',
    example: 'qwerty',
  })
  @IsString()
  readonly password: string;

  @ApiProperty({
    description: 'Nickname',
    type: 'string',
    example: 'joshA',
    uniqueItems: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly nickname: string;

  @ApiProperty({
    description: 'Name',
    type: 'string',
    example: 'Josh A',
    uniqueItems: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly name: string;

  @ApiProperty({
    description: 'Phone',
    type: 'string',
    example: '+380980777162',
    uniqueItems: true,
    required: false,
  })
  @IsPhoneNumber()
  @IsOptional()
  readonly phone: string;

  @ApiProperty({
    description: 'Role',
    type: [UserRoles.Player, UserRoles.Admin],
    example: [UserRoles.Player, UserRoles.Admin],
    required: false,
  })
  @IsEnum([UserRoles.Player, UserRoles.Admin], {
    each: true,
  })
  readonly roles: Array<string>;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'Email',
    type: 'string',
    uniqueItems: true,
    example: 'example@mail.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  readonly user_email?: string;

  @ApiProperty({
    description: 'Password',
    type: 'string',
    example: 'qwerty',
    required: false,
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'Nickname',
    type: 'string',
    example: 'joshA',
    uniqueItems: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly nickname?: string;

  @ApiProperty({
    description: 'Name',
    type: 'string',
    example: 'Josh A',
    uniqueItems: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiProperty({
    description: 'Phone',
    type: 'string',
    example: '+380980777162',
    uniqueItems: true,
    required: false,
  })
  @IsPhoneNumber()
  @IsOptional()
  readonly phone?: string;

  @ApiProperty({
    description: 'Role',
    type: [UserRoles.Player, UserRoles.Admin],
    example: [UserRoles.Player],
    required: false,
  })
  @IsEnum([UserRoles.Player, UserRoles.Admin], {
    each: true,
  })
  @IsOptional()
  readonly roles?: Array<string>;

  @ApiProperty({
    description: 'Can login',
    type: Boolean,
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  readonly canLogin: boolean;
}

export class GetUsersDto extends UserDto {}

export class GetUserDto extends UserDto {}

export class GetUsersQueries extends PaginationDto {}

export class GetAdminUsersResponseDto extends UserDto {
  // @ApiProperty({
  //   description: 'Email',
  //   type: 'string',
  //   uniqueItems: true,
  //   example: 'example@mail.com',
  //   required: false,
  // })
  // readonly _id: string;
  //
  // @ApiProperty({
  //   description: 'Email',
  //   type: String,
  //   example: 'test10@gmail.com',
  // })
  // readonly email: string;
  //
  // @ApiProperty({
  //   description: 'Name',
  //   type: 'string',
  //   example: 'Josh A',
  //   uniqueItems: true,
  // })
  // readonly name: string;
  //
  // @ApiProperty({
  //   description: 'Phone',
  //   type: 'string',
  //   example: '+380980777162',
  //   uniqueItems: true,
  // })
  // readonly phone: string;
  //
  // @ApiProperty({
  //   description: 'User is active',
  //   type: Boolean,
  //   example: true,
  //   default: false,
  // })
  // readonly isActive: false;
  //
  // @ApiProperty({
  //   description: 'Sharing ID',
  //   type: String,
  //   uniqueItems: true,
  //   example: '1947177991',
  // })
  // readonly sharingId: string;
  //
  // @ApiProperty({
  //   description: 'Sharing ID',
  //   type: Array,
  //   example: ['Player', 'Admin'],
  // })
  // readonly roles: UserRoles[];
  //
  // @ApiProperty({
  //   description: 'Can login',
  //   type: Boolean,
  //   example: true,
  //   default: true,
  // })
  // readonly canLogin: boolean;
}

export class GetUsersResponseDto {
  @ApiProperty({
    description: 'Total number of users',
    type: Number,
    example: 3191,
  })
  total: number;

  @ApiProperty({
    description: 'Users lists',
    type: UserDto,
    isArray: true,
  })
  users: UserDto[];
}
