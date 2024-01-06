import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Roles, RolesGuard } from '../auth/guards/roles.guard';
import { UserRoles } from '../user/schemas/user.schema';
import { GetAnalyticsResponseDto } from './dtos/analytics.dto';
import { AnalyticsService } from './services/analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiOperation({
    summary: 'Get app analytics',
    description: 'Get app analytics',
  })
  @ApiOkResponse({
    description: 'Analytics got successfully',
    type: GetAnalyticsResponseDto,
  })
  @ApiBearerAuth('Bearer')
  @Roles([UserRoles.Admin])
  @UseGuards(RolesGuard)
  @Get()
  async getAll() {
    return this.analyticsService.getAll();
  }
}
