import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { TournamentGateway } from './gateways/tournament.gateway';
import { TournamentSchema } from './schemas/tournament.schema';
import { TournamentsService } from './services/tournaments.service';
import { TournamentsController } from './tournaments.controller';

@Module({
  providers: [TournamentsService],
  controllers: [TournamentsController],
  imports: [
    MongooseModule.forFeature([
      { name: 'tournaments', schema: TournamentSchema },
    ]),
    UserModule,
    AuthModule,
    TournamentGateway,
  ],
  exports: [
    MongooseModule.forFeature([
      { name: 'tournaments', schema: TournamentSchema },
    ]),
    TournamentsService,
  ],
})
export class TournamentsModule {}
