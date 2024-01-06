import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { UserEntity } from '../../user/schemas/user.schema';

@Schema()
export class TokensEntity {
  @Prop({ type: Types.ObjectId, ref: 'UserEntity' })
  userId: UserEntity;

  @Prop({
    required: true,
  })
  refreshToken: string;
}

export type TokensDocument = HydratedDocument<TokensEntity>;

export const TokensSchema = SchemaFactory.createForClass(TokensEntity);
