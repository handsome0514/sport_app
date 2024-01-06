import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import type { Application } from 'express';
import { connect, connection } from 'mongoose';

import { AppModule } from '../../src/app.module';
import { getModels, IModels } from '../utils/get-models.util';
import { UserActions } from '../utils/user-action.util';

describe('AnalyticsController (e2e)', () => {
  let module: TestingModule;
  let app: Application;
  let application: INestApplication;
  let models: IModels;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    application = await module
      .createNestApplication()
      .use(cookieParser())
      .useGlobalPipes(
        new ValidationPipe({
          transform: true,
          whitelist: true,
        }),
      )
      .init();

    app = application.getHttpServer();

    const configService = application.get<ConfigService>(ConfigService);

    await connect(configService.get('dbConnection'));

    models = await getModels(application);
  });

  beforeEach(async () => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  const user = {
    user_email: '123@mail.com',
    password: 'qwerty',
  };

  it('get analytics', async () => {
    const user = new UserActions(app);

    await user.register();

    await models.userModel.updateOne(
      {
        _id: user.data._id,
      },
      {
        roles: [...user.data.roles, 'Admin'],
      },
    );

    await user.login();

    const r = await user.request({
      url: '/analytics',
      method: 'get',
    });

    expect(r.body.tournaments).toBe(0);
    expect(r.body.users).toBe(1);
  });

  it('deny to get analytics for not an admin', async () => {
    const user = new UserActions(app);

    await user.register();

    const r = await user.request({
      url: '/analytics',
      method: 'get',
      expect: 403,
    });

    expect(r.body.message).toBe('Forbidden resource');
  });
});
