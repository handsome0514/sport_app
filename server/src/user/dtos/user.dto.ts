import { ApiProperty } from '@nestjs/swagger';

import { UserRoles } from '../schemas/user.schema';

export class UserDto {
  @ApiProperty({
    description: 'User ID',
    type: String,
    example: '6463c257a52aa6394ba0cd4e',
  })
  _id: string;

  @ApiProperty({
    description: 'User email',
    type: String,
    example: 'example@mail.com',
  })
  email: string;

  @ApiProperty({
    description: 'User name',
    type: String,
    example: 'Jake Hill',
  })
  name?: string;

  @ApiProperty({
    description: 'User nickname',
    type: String,
    example: 'jakeHill',
  })
  nickname?: string;

  @ApiProperty({
    description: 'User phone',
    type: String,
    example: '+380980888111',
  })
  phone?: string;

  @ApiProperty({
    description: 'User is active',
    type: Boolean,
    default: true,
    example: true,
  })
  isActivated: boolean;

  @ApiProperty({
    description: 'User activation link',
    type: String,
    example: 'cialejalkclkkasdfi',
  })
  activationLink?: string;

  @ApiProperty({
    description: 'Sharing ID',
    type: String,
    example: '184118',
  })
  sharingId?: string;

  @ApiProperty({
    description: 'User ID',
    type: [UserRoles.Player, UserRoles.Admin, UserRoles.MasterAdmin],
    example: [UserRoles.Player, UserRoles.Admin],
    default: [UserRoles.Player],
  })
  roles: UserRoles[];

  @ApiProperty({
    description: 'User can login indicator',
    type: String,
    example: true,
    default: true,
  })
  canLogin: boolean;
}

export class PatchUserPictureDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  picture: Express.Multer.File;
}
