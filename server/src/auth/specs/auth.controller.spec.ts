import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { UserModule } from '../../user/user.module';
import { AuthController } from '../auth.controller';
import { AuthService } from '../services/auth.service';
import { AuthModuleService } from '../services/auth-module.service';
import { JwtTokenService } from '../services/jwt-token.service';
import { JwtStrategy } from '../strategies/jwt.strategy';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthModuleService, AuthService, JwtTokenService, JwtStrategy],
      imports: [UserModule, JwtModule],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
