import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TokensDocument } from '../../src/auth/schemas/tokens.schema';
import { TournamentDocument } from '../../src/tournaments/schemas/tournament.schema';
import { UserDocument } from '../../src/user/schemas/user.schema';

export interface IModels {
  userModel: Model<UserDocument>;
  tokenModel: Model<TokensDocument>;
  tournamentModel: Model<TournamentDocument>;
}

export const getModels = (application: INestApplication): IModels => {
  const userModel = application.get<Model<UserDocument>>(
    getModelToken('users'),
  );
  const tokenModel = application.get<Model<TokensDocument>>(
    getModelToken('tokens'),
  );
  const tournamentModel = application.get<Model<TournamentDocument>>(
    getModelToken('tournaments'),
  );

  return {
    userModel,
    tokenModel,
    tournamentModel,
  };
};
