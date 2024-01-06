import { UserRoles } from '../../user/schemas/user.schema';

export interface IJwtTokenData {
  _id: string;
  roles: UserRoles[];
}

export interface IPairTokens {
  accessToken: string;
  refreshToken: string;
}
