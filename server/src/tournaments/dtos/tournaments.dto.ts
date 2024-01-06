import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

import { UserEntity } from '../../user/schemas/user.schema';

export class CreateTournamentDto {
  @ApiProperty({
    description: 'User creator ID',
    type: String,
  })
  @IsString()
  readonly creator: string;

  @ApiProperty({
    description: 'Rules',
    type: String,
    example: 'Classic',
  })
  rules: string;

  @ApiProperty({
    description: 'Tournament name',
    type: String,
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Tournament data',
    type: String,
  })
  @IsString()
  readonly date: string;

  @ApiProperty({
    description: 'Tournament place',
    type: String,
  })
  @IsString()
  readonly place: string;

  @ApiProperty({
    description: 'Additional information',
    type: String,
  })
  @IsString()
  readonly additional: string;

  @ApiProperty({
    description:
      'Number of participants<br>Uses when create ELO tournament<br>Must be an even number',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  readonly participants: number;

  @ApiProperty({
    description: 'Drafts',
    type: Boolean,
  })
  @IsBoolean()
  readonly drafts: boolean;

  @ApiProperty({
    description: 'Tournament brackets',
    type: String,
  })
  readonly tournament_bracket: [any];

  @ApiProperty({
    description: 'Is tournament classic',
    type: Boolean,
  })
  @IsBoolean()
  readonly classic: boolean;

  @ApiProperty({
    description: 'Tournament with ELO ranking?',
    type: Boolean,
    default: false,
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  readonly elo?: boolean;

  @ApiProperty({
    description: 'K-factor for ELO tournament',
    type: Boolean,
    default: 32,
    example: 40,
  })
  @IsNumber()
  @IsOptional()
  readonly kFactor?: number;
}

export class UpdateTournamentDto {
  @ApiProperty({
    description: 'Drafts',
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  readonly drafts?: boolean;

  @ApiProperty({
    description: 'Tournament brackets',
    type: String,
  })
  @IsOptional()
  readonly tournament_bracket?: [any];

  @ApiProperty({
    description: 'Started',
    type: Boolean,
    example: false,
  })
  @IsOptional()
  started?: boolean;

  @ApiProperty({
    description: 'Started at',
    type: String,
    example: '2023-05-17',
  })
  @IsOptional()
  started_at?: string;

  @ApiProperty({
    description: 'Ended at',
    type: String,
    example: '2023-05-17',
  })
  @IsOptional()
  ended_at?: string;
}

export class TournamentDto {
  @ApiProperty({
    description: 'Tournament ID',
    type: String,
    example: '64649235a9891e81218e6e0c',
  })
  _id: UserEntity;

  @ApiProperty({
    description: 'User ID',
    type: String,
  })
  creator: string;

  @ApiProperty({
    description: 'Tournament name',
    type: String,
    example: 'Mont',
  })
  name: string;

  @ApiProperty({
    description: 'Date',
    type: Date,
    example: '2023-05-17',
  })
  date: string;

  @ApiProperty({
    description: 'Tournament place',
    type: String,
    example: 'USA',
  })
  place: string;

  @ApiProperty({
    description: 'Additional information',
    type: String,
    example: 'Nothing special',
  })
  additional: string;

  @ApiProperty({
    description: 'Participants',
    type: String,
    example: 'none',
  })
  participants: string;

  @ApiProperty({
    description: 'Rules',
    type: String,
    example: 'Classic',
  })
  rules: string;

  @ApiProperty({
    description: 'Playtime',
    type: String,
    example: '2h',
  })
  playtime: string;

  @ApiProperty({
    description: 'Tournament brackets',
    type: '',
    isArray: true,
  })
  tournament_bracket: Array<any>;

  @ApiProperty({
    description: 'Drafts',
    type: Boolean,
    example: true,
  })
  drafts: boolean;

  @ApiProperty({
    description: 'Code link',
    type: String,
    example: '123841',
  })
  code_link: string;

  @ApiProperty({
    description: 'Players',
    type: '',
    isArray: true,
  })
  players: Array<any>;

  @ApiProperty({
    description: 'Classic',
    type: Boolean,
    example: true,
  })
  classic: boolean;

  @ApiProperty({
    description: 'Started',
    type: Boolean,
    example: false,
  })
  started: boolean;

  @ApiProperty({
    description: 'Started at',
    type: String,
    example: '2023-05-17',
  })
  started_at: string;

  @ApiProperty({
    description: 'Ended at',
    type: String,
    example: '2023-05-17',
  })
  ended_at: string;
}

export class GetTournamentsResponseDto {
  @ApiProperty({
    description: 'Total number of tournaments',
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'Tournaments list',
    type: TournamentDto,
    isArray: true,
  })
  tournaments: TournamentDto[];
}

export class JointTournamentResponseDto {
  @ApiProperty({
    description: 'Tournament link',
    type: String,
    example: '/tournament/64649235a9891e81218e6e0c',
  })
  link: string;
}

export class AddPlayerDto {
  @ApiProperty({
    description: 'Tournament _id',
    type: String,
    example: '64649235a9891e81218e6e0c',
  })
  @IsString()
  readonly _id: string;

  @ApiProperty({
    description: 'User nickname',
    type: String,
    example: 'joshA',
  })
  @IsString()
  readonly nickname: string;

  @ApiProperty({
    description: 'User object',
  })
  readonly user: any;

  @ApiProperty({
    description: 'User team',
    type: String,
    example: 'red',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly team?: 'red' | 'blue';
}
