import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { UserDocument } from '../../user/schemas/user.schema';
import { LogInDto, RegisterDto } from '../dtos/auth.dto';
import { IJwtTokenData } from '../interfaces';
import { TokensDocument } from '../schemas/tokens.schema';
import { AuthService } from './auth.service';
import { JwtTokenService } from './jwt-token.service';

@Injectable()
export class AuthModuleService {
  private readonly passwordSalt: number;

  constructor(
    @InjectModel('users')
    private readonly userModel: Model<UserDocument>,
    @InjectModel('tokens')
    private readonly tokensModel: Model<TokensDocument>,
    private readonly authService: AuthService,
    private readonly jwtTokensService: JwtTokenService,
    private readonly configService: ConfigService,
  ) {
    this.passwordSalt = this.configService.get('PASSWORD_SALT');
  }

  async registration(data: RegisterDto) {
    const candidate = await this.userModel.findOne({
      email: data.user_email,
    });

    if (candidate?.email == data.user_email) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = bcryptjs.hashSync(
      data.password,
      this.configService.get('passwordSalt'),
    );

    return this.userModel.create({
      email: data.user_email.toLowerCase(),
      password: passwordHash,
      sharingId: new Types.ObjectId(),
      activationLink: uuidv4(),
    });
  }

  async logIn(data: LogInDto) {
    const candidate = await this.userModel
      .findOne({
        email: data.user_email.toLowerCase(),
      })
      .lean();

    // Check if user can log in
    if (!candidate.canLogin) {
      throw new BadRequestException('You can not login');
    }

    const tokens = await this.jwtTokensService.generatePairTokens({
      _id: candidate._id.toString(),
      roles: candidate.roles,
    });

    await this.tokensModel.create({
      userId: candidate._id.toString(),
      refreshToken: tokens.refreshToken,
    });

    const { password, ...userData } = candidate;

    return {
      ...tokens,
      user: userData,
    };
  }

  async logOut(refreshToken: string) {
    let decodedRefreshToken: IJwtTokenData;

    try {
      decodedRefreshToken = await this.jwtTokensService.validateRefreshToken(
        refreshToken,
      );
    } catch (e) {
      throw new BadRequestException('Bad refresh token');
    }

    const sessionCandidate = await this.tokensModel.findOne({
      userId: decodedRefreshToken._id,
      refreshToken,
    });

    if (!sessionCandidate) {
      throw new BadRequestException('Session not exists');
    }

    await this.tokensModel.deleteOne({
      _id: sessionCandidate._id,
    });
  }

  async refresh(refreshToken: string) {
    let decodedRefreshToken: IJwtTokenData;

    try {
      decodedRefreshToken = await this.jwtTokensService.validateRefreshToken(
        refreshToken,
      );
    } catch (e) {
      throw new BadRequestException('Bad refresh token');
    }

    // Check if user exists
    let candidate: UserDocument;

    try {
      candidate = await this.userModel
        .findOne({
          _id: decodedRefreshToken._id,
        })
        .lean();
    } catch (e) {
      throw new BadRequestException('Bad refresh token');
    }

    if (!candidate) {
      throw new BadRequestException('User not exists');
    }

    // Check if user can log in
    if (!candidate?.canLogin) {
      throw new BadRequestException('You can not refresh tokens');
    }

    const sessionCandidate = await this.tokensModel.findOne({
      refreshToken,
      userId: decodedRefreshToken._id,
    });

    if (!sessionCandidate) {
      throw new BadRequestException('Session not exists');
    }

    const tokens = await this.jwtTokensService.generatePairTokens({
      _id: decodedRefreshToken._id,
      roles: decodedRefreshToken.roles,
    });

    await this.tokensModel.updateOne(
      {
        _id: sessionCandidate._id,
      },
      {
        refreshToken: tokens.refreshToken,
      },
    );

    const { password, ...userData } = candidate;

    return {
      ...tokens,
      user: userData,
    };
  }

  async activate(activationLink: string) {
    const user = await this.userModel.findOne({ activationLink });

    if (!user) {
      throw new BadRequestException('Invalid activation link');
    }

    user.isActivated = true;
    await user.save();

    return true;
  }

  // async forgotPassword({ email }: ForgotPasswordDto) {
  //   const candidate = await this.userModel.findOne({
  //     email,
  //   });
  //
  //   if (!candidate) {
  //     throw new BadRequestException('User with this email is not registered');
  //   }
  //
  //   // TODO send mail with reset password url
  // }
  //
  // async resetPassword(data: ResetPasswordDto) {
  //   // TODO check if reset password url is correct
  //
  //   const candidate = await this.userModel.findOne({
  //     _id: data.userId,
  //   });
  //
  //   if (!candidate) {
  //     throw new BadRequestException('User with this email is not registered');
  //   }
  //
  //   const passwordHash = bcryptjs.hashSync(
  //     data.password,
  //     this.configService.get('passwordSalt'),
  //   );
  //
  //   await this.userModel.updateOne(
  //     {
  //       _id: candidate._id,
  //     },
  //     {
  //       password: passwordHash,
  //     },
  //   );
  // }
}
