import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<UserEntity>;

export enum UserRoles {
  Player = 'Player',
  Admin = 'Admin',
  MasterAdmin = 'MasterAdmin',
}

@Schema()
export class UserEntity {
  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @Prop({ default: '' })
  name?: string;

  @Prop({ default: '' })
  nickname?: string;

  @Prop({
    default: '',
  })
  phone?: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    default: false,
  })
  isActivated: boolean;

  @Prop()
  activationLink?: string;

  @Prop({
    default: '',
  })
  sharingId?: string;

  @Prop({
    type: [String],
    enum: [UserRoles.Player, UserRoles.Admin, UserRoles.MasterAdmin],
    default: [UserRoles.Player],
  })
  roles: UserRoles[];

  @Prop({
    default: true,
  })
  canLogin: boolean;

  @Prop({
    default: 0,
    nullable: true,
  })
  playedGames?: number;

  @Prop({
    default: 0,
    nullable: true,
  })
  wins?: number;

  @Prop({
    default: 0,
    nullable: true,
  })
  trophies?: number;

  @Prop({
    default: 0,
    nullable: true,
  })
  atpStanding?: number;

  @Prop({
    default: 1,
  })
  eloRank?: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'user-pictures',
  })
  pictureId?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
