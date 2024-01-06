import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { TokensSchema } from './schemas/tokens.schema';
import { AuthService } from './services/auth.service';
import { AuthModuleService } from './services/auth-module.service';
import { JwtTokenService } from './services/jwt-token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthModuleService,
    AuthService,
    JwtTokenService,
    LocalStrategy,
    JwtStrategy,
  ],
  imports: [
    MongooseModule.forFeature([{ name: 'tokens', schema: TokensSchema }]),
    UserModule,
    JwtModule,
  ],
  exports: [
    AuthModuleService,
    AuthService,
    JwtTokenService,
    LocalStrategy,
    JwtStrategy,
    MongooseModule.forFeature([{ name: 'tokens', schema: TokensSchema }]),
  ],
})
export class AuthModule {}
