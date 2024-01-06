import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserPictureDocument = HydratedDocument<UserPictureEntity>;

@Schema()
export class UserPictureEntity {
  @Prop({
    type: Buffer,
    nullable: true,
  })
  picture?: Buffer;
}

export const UserPictureSchema =
  SchemaFactory.createForClass(UserPictureEntity);
