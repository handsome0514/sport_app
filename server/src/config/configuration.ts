function requireEnvVariable(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} env variable is required`);
  }

  return value;
}

export const config = () => {
  return {
    portApi: parseInt(process.env.PORT_API) || 3000,
    dbConnection: requireEnvVariable('DB_CONNECT'),
    passwordSalt: parseInt(requireEnvVariable('PASSWORD_SALT'), 10),
    jwtAccessTokenSecret: requireEnvVariable('JWT_ACCESS_TOKEN_SECRET'),
    jwtAccessTokenExpiresIn: parseInt(
      requireEnvVariable('JWT_ACCESS_TOKEN_EXPIRES_IN'),
      10,
    ),
    jwtRefreshTokenSecret: requireEnvVariable('JWT_REFRESH_TOKEN_SECRET'),
    jwtRefreshTokenExpiresIn: parseInt(
      requireEnvVariable('JWT_REFRESH_TOKEN_EXPIRES_IN'),
      10,
    ),
  };
};
