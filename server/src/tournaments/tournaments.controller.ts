import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Roles, RolesGuard } from '../auth/guards/roles.guard';
import { ProtectedRequest } from '../auth/interfaces/protected-request.interface';
import { UserRoles } from '../user/schemas/user.schema';
import {
  AddPlayerDto,
  CreateTournamentDto,
  GetTournamentsResponseDto,
  JointTournamentResponseDto,
  TournamentDto,
  UpdateTournamentDto,
} from './dtos/tournaments.dto';
import { TournamentsService } from './services/tournaments.service';

@ApiTags('Tournaments')
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentService: TournamentsService) {}

  @ApiOperation({
    summary: 'Get all own tournaments',
    description: 'Get all own tournaments',
  })
  @ApiOkResponse({
    description: 'Got tournaments successfully',
    type: GetTournamentsResponseDto,
  })
  @ApiBearerAuth('Bearer')
  @Roles([UserRoles.Player])
  @UseGuards(RolesGuard)
  @Get('')
  async getTournaments(@Req() req: ProtectedRequest) {
    return this.tournamentService.getTournaments(req.user);
  }

  @ApiOperation({
    summary: 'Get all tournaments by sharing ID',
    description: 'Get all tournaments by sharing ID',
  })
  @ApiOkResponse({
    description: 'Got tournaments successfully',
    type: TournamentDto,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'Sharing ID not found' })
  @ApiBearerAuth('Bearer')
  @Roles([UserRoles.Player])
  @UseGuards(RolesGuard)
  @Get('join')
  async getAllTournamentsBySharingId(@Query('sharingId') sharingId: string) {
    return this.tournamentService.getAllTournamentsBySharingId(sharingId);
  }

  @ApiOperation({
    summary: 'Get tournament by ID',
    description: 'Get tournament by ID',
  })
  @ApiOkResponse({
    description: 'Got tournament successfully',
    type: TournamentDto,
  })
  @ApiNotFoundResponse({ description: 'Tournament not found' })
  @Get(':_id')
  async getOneById(@Param('_id') _id: string) {
    return this.tournamentService.getOneById(_id);
  }

  @ApiOperation({
    summary: 'Get tournament link by code',
    description: 'Get tournament link by code',
  })
  @ApiOkResponse({
    description: 'Got tournament link successfully',
    type: JointTournamentResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Tournament not found' })
  @Get('code/:code')
  async joinTournamentByCode(@Param('code') code: string) {
    return this.tournamentService.jointTournamentByCode(code);
  }

  @ApiOperation({
    summary: 'Create tournament',
    description: 'Create tournament',
  })
  @ApiOkResponse({
    description: 'Tournament created successfully',
    type: TournamentDto,
  })
  @ApiBearerAuth('Bearer')
  @Roles([UserRoles.Player])
  @UseGuards(RolesGuard)
  @Post('')
  async createTournament(
    @Req() req: ProtectedRequest,
    @Body() data: CreateTournamentDto,
  ) {
    return this.tournamentService.createTournament(req.user, data);
  }

  @ApiOperation({
    summary: 'Update tournament',
    description: 'Update tournament',
  })
  @ApiOkResponse({
    description: 'Tournament updated successfully',
    type: TournamentDto,
  })
  @ApiBearerAuth('Bearer')
  @Roles([UserRoles.Player])
  @UseGuards(RolesGuard)
  @Patch(':_id')
  async updateTournament(
    @Param('_id') _id: string,
    @Body() data: UpdateTournamentDto,
  ) {
    return this.tournamentService.updateTournament(_id, data);
  }

  @ApiOperation({
    summary: 'Add players to exists tournament',
    description: 'Add players to exists tournament',
  })
  @ApiOkResponse({ description: 'Players added successfully' })
  @ApiBadRequestResponse({ description: 'Tournament not found' })
  @ApiBearerAuth('Bearer')
  @Roles([UserRoles.Player])
  @UseGuards(RolesGuard)
  @Post('add-players')
  async addPlayer(@Body() data: AddPlayerDto) {
    return this.tournamentService.addPlayer(data);
  }

  @ApiOperation({
    summary: 'Delete tournament by _id',
    description: 'Delete tournament by _id',
  })
  @ApiOkResponse({ description: 'Tournament deleted successfully' })
  @ApiBadRequestResponse({ description: 'Tournament not exists' })
  @ApiBearerAuth('Bearer')
  @Roles([UserRoles.Player])
  @UseGuards(RolesGuard)
  @Delete(':_id')
  async deleteTournament(
    @Param('_id') _id: string,
    @Req() req: ProtectedRequest,
  ) {
    await this.tournamentService.deleteTournament(_id, req.user);
  }
}
