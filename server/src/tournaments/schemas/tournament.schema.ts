import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { UserEntity } from '../../user/schemas/user.schema';

export type TournamentDocument = HydratedDocument<TournamentEntity>;

@Schema()
export class TournamentEntity {
  @Prop({ type: Types.ObjectId, ref: 'UserEntity' })
  creator: UserEntity;

  @Prop({
    unique: false,
  })
  name: string;

  @Prop({
    required: true,
  })
  date: string;

  @Prop({
    required: true,
  })
  place: string;

  @Prop()
  additional: string;

  @Prop()
  participants: number;

  @Prop()
  rules: string;

  @Prop()
  playtime: string;

  @Prop({
    required: true,
  })
  tournament_bracket: Array<any>;

  @Prop({
    required: true,
  })
  drafts: boolean;

  @Prop({
    unnique: true,
    required: true,
  })
  code_link: string;

  @Prop()
  ended_at: string;

  @Prop({
    default: false,
  })
  started: boolean;

  @Prop({
    default: [],
  })
  players: Array<any>;

  @Prop({
    default: true,
  })
  classic: boolean;

  @Prop({
    default: false,
  })
  elo?: boolean;

  @Prop({
    default: null,
  })
  kFactor?: number;

  @Prop()
  started_at: string;
}

export const TournamentSchema = SchemaFactory.createForClass(TournamentEntity);
