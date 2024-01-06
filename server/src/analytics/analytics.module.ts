import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { TournamentsModule } from '../tournaments/tournaments.module';
import { UserModule } from '../user/user.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './services/analytics.service';

@Module({
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  imports: [AuthModule, UserModule, TournamentsModule],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
