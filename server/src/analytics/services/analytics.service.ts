import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TournamentDocument } from '../../tournaments/schemas/tournament.schema';
import { UserDocument } from '../../user/schemas/user.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel('tournaments')
    private readonly tournamentsModel: Model<TournamentDocument>,
    @InjectModel('users')
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getAll() {
    const tournaments = await this.tournamentsModel.countDocuments();
    const users = await this.userModel.countDocuments();

    return {
      tournaments,
      users,
    };
  }
}
