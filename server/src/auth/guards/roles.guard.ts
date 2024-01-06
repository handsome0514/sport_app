import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRoles } from '../../user/schemas/user.schema';
import { IJwtTokenData } from '../interfaces';
import { JwtTokenService } from '../services/jwt-token.service';

export const Roles = (roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<UserRoles[]>(
      'roles',
      context.getHandler(),
    );
    const req = context.switchToHttp().getRequest();

    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new UnauthorizedException();
    }

    let validated: IJwtTokenData;

    try {
      const jwtToken = authorizationHeader.split(' ')[1];

      validated = await this.jwtTokenService.validateAccessToken(jwtToken);
    } catch (e) {
      throw new UnauthorizedException();
    }

    let available = true;

    req.user = validated;

    for (let i = 0; i < roles.length; i++) {
      if (!validated.roles.includes(roles[i])) {
        available = false;
        break;
      }
    }

    return available;
  }
}
