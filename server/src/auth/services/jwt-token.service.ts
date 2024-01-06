import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { IJwtTokenData, IPairTokens } from '../interfaces';

@Injectable()
export class JwtTokenService {
  jwtAccessTokenSecret: string;
  jwtRefreshTokenSecret: string;
  jwtAccessTokenExpiresIn: string;
  jwtRefreshTokenExpiresIn: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtAccessTokenSecret = this.configService.get('jwtAccessTokenSecret');
    this.jwtAccessTokenExpiresIn = this.configService.get(
      'jwtAccessTokenExpiresIn',
    );
    this.jwtRefreshTokenSecret = this.configService.get(
      'jwtRefreshTokenSecret',
    );
    this.jwtRefreshTokenExpiresIn = this.configService.get(
      'jwtRefreshTokenExpiresIn',
    );
  }

  async generateAccessToken(data: IJwtTokenData) {
    return this.jwtService.sign(data, {
      secret: this.jwtAccessTokenSecret,
      expiresIn: this.jwtAccessTokenExpiresIn,
    });
  }

  async generateRefreshToken(data: IJwtTokenData) {
    return this.jwtService.sign(data, {
      secret: this.jwtRefreshTokenSecret,
      expiresIn: this.jwtRefreshTokenExpiresIn,
    });
  }

  async generatePairTokens(data: IJwtTokenData): Promise<IPairTokens> {
    return {
      accessToken: await this.generateAccessToken(data),
      refreshToken: await this.generateRefreshToken(data),
    };
  }

  async validateAccessToken(accessToken: string) {
    return this.jwtService.verify<IJwtTokenData>(accessToken, {
      secret: this.jwtAccessTokenSecret,
    });
  }

  async validateRefreshToken(refreshToken: string) {
    return this.jwtService.verify<IJwtTokenData>(refreshToken, {
      secret: this.jwtRefreshTokenSecret,
    });
  }
}
