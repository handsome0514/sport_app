import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IJwtTokenData } from '../../auth/interfaces';
import { UserDocument } from '../../user/schemas/user.schema';
import {
  AddPlayerDto,
  CreateTournamentDto,
  UpdateTournamentDto,
} from '../dtos/tournaments.dto';
import { TournamentDocument } from '../schemas/tournament.schema';

class Player {
  elo: number;
  constructor(elo: number) {
    this.elo = elo;
  }
}

function calculateElo(
  player1: Player,
  player2: Player,
  outcome: number,
  k: number,
): [number, number] {
  const expectedOutcome1 =
    1 / (1 + Math.pow(10, (player2.elo - player1.elo) / 400));
  const expectedOutcome2 =
    1 / (1 + Math.pow(10, (player1.elo - player2.elo) / 400));
  const newElo1 = player1.elo + k * (outcome - expectedOutcome1);
  const newElo2 = player2.elo + k * (1 - outcome - expectedOutcome2);
  return [newElo1, newElo2];
}

@Injectable()
export class TournamentsService {
  isRunning = false;

  constructor(
    @InjectModel('tournaments')
    private readonly tournamentModel: Model<TournamentDocument>,
    @InjectModel('users')
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getTournaments(user: IJwtTokenData) {
    const tournaments = await this.tournamentModel
      .find({
        creator: user._id,
      })
      .lean();

    const total = await this.userModel.countDocuments();

    return {
      total,
      tournaments,
    };
  }

  async getAllTournamentsBySharingId(sharingId: string) {
    const candidate = await this.userModel.findOne({
      sharingId,
    });

    if (!candidate) {
      throw new BadRequestException('Bad sharing ID');
    }

    return this.tournamentModel
      .find({
        creator: candidate._id.toString(),
        started: true,
        ended_at: null,
      })
      .select('-__v')
      .lean();
  }

  async getOneById(_id: string) {
    let result: TournamentDocument;

    try {
      result = await this.tournamentModel
        .findOne({
          _id,
        })
        .select('-id')
        .lean();
    } catch (e) {
      throw new BadRequestException('Invalid _id');
    }

    if (!result) {
      throw new BadRequestException('Tournament not exists');
    }

    return result;
  }

  async jointTournamentByCode(code: string) {
    const result = await this.tournamentModel.findOne({
      code_link: code,
    });

    if (!result) {
      throw new BadRequestException('Tournament not exists');
    }

    return { link: `/tournament/${result._id}` };
  }

  async createTournament(user: IJwtTokenData, data: CreateTournamentDto) {
    const creatorCandidate = await this.userModel.findOne({
      _id: user._id,
    });

    if (!creatorCandidate) {
      throw new BadRequestException('User not exists');
    }

    let newTournament: TournamentDocument;

    // Generate players if elo is true
    if (data.elo) {
      if (!data.participants) {
        throw new BadRequestException(
          'In ELO tournament `participants` is required',
        );
      }

      if (data.participants % 2 !== 0) {
        throw new BadRequestException('Participants must be an even number');
      }

      const checkNumberOfUsers = await this.userModel
        .find({ eloRank: { $ne: null } })
        .countDocuments();

      if (checkNumberOfUsers <= data.participants) {
        throw new BadRequestException(
          'Not enough users to create an elo tournament',
        );
      }

      if (data.participants > 10) {
        throw new BadRequestException('Max number of participants is 10');
      }

      const creatorEloRank = creatorCandidate.eloRank || 1;

      let usersWithSimilarEloRank: UserDocument[] = [];
      let i = 10;

      while (usersWithSimilarEloRank?.length !== data.participants) {
        if (i >= 100) {
          throw new BadRequestException(
            'Not enough users to create an elo tournament',
          );
        }

        usersWithSimilarEloRank = await this.userModel
          .find({
            eloRank: {
              $gte: creatorEloRank - (creatorEloRank / 100) * i,
              $lte: creatorEloRank + (creatorEloRank / 100) * i,
            },
            name: { $exists: true, $ne: '' },
          })
          .limit(data.participants)
          .select('-password -__v')
          .lean();

        i += 10;
      }

      newTournament = await this.tournamentModel.create({
        ...data,
        players: usersWithSimilarEloRank.map((i) => ({
          ...i,
          guest: true,
          team: null,
          selected: true,
        })),
        code_link: uuidv4(),
      });
    } else {
      newTournament = await this.tournamentModel.create({
        ...data,
        code_link: uuidv4(),
      });
    }

    return this.tournamentModel
      .findOne({ _id: newTournament._id })
      .select('-__v')
      .lean()
      .exec();
  }

  async updateTournament(_id: string, data: UpdateTournamentDto) {
    let candidate: TournamentDocument;

    try {
      candidate = await this.tournamentModel.findOne({
        _id,
      });
    } catch (e) {
      throw new BadRequestException('Tournament not exists');
    }

    if (!candidate) {
      throw new BadRequestException('Tournament not exists');
    }

    // Handle ELO tanks when tournament ended
    if (data?.ended_at) {
      if (Array.isArray(candidate.tournament_bracket)) {
        for (let i = 0; i < candidate?.tournament_bracket?.[0]?.length; i++) {
          if (!Array.isArray(candidate?.tournament_bracket[0])) {
            continue;
          }
          let outcome: number;

          if (candidate.tournament_bracket[0][i][0].win) {
            outcome = 1;
          } else if (candidate.tournament_bracket[0][i][1].win) {
            outcome = 0;
          }

          if (outcome === undefined) {
            continue;
          }

          let player1Id: string;
          let player2Id: string;

          for (let j = 0; j < candidate.players.length; j++) {
            if (
              candidate.tournament_bracket[0][i][0].name ===
              candidate.players[j].name
            ) {
              player1Id = candidate.players[j]._id;

              if (player1Id && player2Id) {
                break;
              }
            } else if (
              candidate.tournament_bracket[0][i][1].name ===
              candidate.players[j].name
            ) {
              player2Id = candidate.players[j]._id;

              if (player1Id && player2Id) {
                break;
              }
            }
          }

          if (!player1Id || !!player2Id) {
            continue;
          }

          const user1 = await this.userModel.findOne({
            _id: player1Id,
          });

          const user2 = await this.userModel.findOne({
            _id: player2Id,
          });

          const player1 = new Player(user1.eloRank);
          const player2 = new Player(user2.eloRank);

          const k = candidate.kFactor ?? 32;

          const [newElo1, newElo2] = calculateElo(player1, player2, outcome, k);

          interface UpdateUserData {
            eloRank: number;
            playedGames: number;
            wins?: number;
            atpStanding?: number;
            trophies?: number;
          }

          const updatePlayer1Data: UpdateUserData = {
            eloRank: outcome === 1 ? newElo1 : newElo2,
            playedGames: user1.playedGames + 1,
          };

          const updatePlayer2Data: UpdateUserData = {
            eloRank: outcome === 1 ? newElo2 : newElo1,
            playedGames: user2.playedGames + 1,
          };

          if (outcome === 1) {
            updatePlayer1Data.wins = user1.wins + 1;
          } else {
            updatePlayer2Data.wins = user1.wins + 1;
          }

          await this.userModel.updateOne(
            {
              _id: player1Id,
            },
            updatePlayer1Data,
          );

          await this.userModel.updateOne(
            {
              _id: player2Id,
            },
            updatePlayer2Data,
          );
        }
      }
    }

    await this.tournamentModel.updateOne(
      {
        _id: candidate._id,
      },
      data,
    );

    return this.tournamentModel
      .findOne({
        _id: candidate._id,
      })
      .select('-__v');
  }

  async addPlayer(data: AddPlayerDto) {
    const tournament = await this.tournamentModel.findOne({
      _id: data._id,
    });

    if (!tournament) {
      throw new BadRequestException('Tournament not exists');
    }

    if (tournament.elo) {
      throw new BadRequestException(
        'Impossible to change players list for ELO tournament',
      );
    }

    const players = [...tournament.players];

    // Check if the user is not a player
    if (
      players.find(
        (item) =>
          item.name === data.user?.nickname || item.name === data.nickname,
      )
    ) {
      throw new BadRequestException('User already is player');
    }

    if (data?.user) {
      players.push({
        guest: false,
        name: data?.user?.nickname,
        selected: true,
        team: data?.team,
      });

      return this.tournamentModel.findByIdAndUpdate(
        { _id: tournament._id },
        { players },
        { new: true },
      );
    }

    players.push({
      guest: true,
      name: data.nickname,
      selected: true,
      team: data?.team,
    });

    return this.tournamentModel.findByIdAndUpdate(
      { _id: tournament._id },
      { players },
      { new: true },
    );
  }

  async deleteTournament(_id: string, user: IJwtTokenData) {
    let candidate;

    try {
      candidate = await this.tournamentModel.findOne({
        _id,
      });
    } catch (e) {
      throw new BadRequestException('Invalid _id');
    }

    if (!candidate) {
      throw new BadRequestException('Tournament not exists');
    }

    if (candidate.creator !== user._id) {
      throw new BadRequestException('This tournament is not belongs to you');
    }

    return this.tournamentModel.deleteOne({
      _id: candidate._id,
    });
  }
}
