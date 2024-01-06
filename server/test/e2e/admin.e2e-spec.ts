import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import type { Application } from 'express';
import { connect, connection } from 'mongoose';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';
import { UserRoles } from '../../src/user/schemas/user.schema';
import { getModels, IModels } from '../utils/get-models.util';
import { UserActions } from '../utils/user-action.util';

describe('AdminController (e2e)', () => {
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

  let admin: UserActions;
  const userData = {
    user_email: 'example@mail.com',
    password: 'qwerty',
    nickname: 'joshA',
    name: 'Josh A',
    phone: '+380980777162',
    roles: ['Player'],
  };

  beforeEach(async () => {
    // Clear database
    await connection.dropDatabase();

    // Create admin user
    admin = new UserActions(app);

    await admin.register();

    const userToBeAdmin = await models.userModel.findOne();

    await models.userModel.updateOne(
      {
        _id: userToBeAdmin._id,
      },
      {
        roles: [...userToBeAdmin.roles, 'Admin', 'MasterAdmin'],
      },
    );

    await admin.login();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('create user', async () => {
    expect(await models.userModel.find().lean()).toHaveLength(1);

    await admin.request({
      url: '/admin/user',
      method: 'post',
      send: userData,
      expect: 201,
    });

    expect(await models.userModel.find()).toHaveLength(2);

    const newUser = await models.userModel
      .findOne({
        email: userData.user_email,
      })
      .lean();

    expect(userData.user_email).toBe(newUser.email);
    expect(userData.password).toBeTruthy();
    expect(userData.nickname).toBe(newUser.nickname);
    expect(userData.name).toBe(newUser.name);
    expect(userData.roles.toString()).toBe(newUser.roles.toString());
  });

  it('get admin users', async () => {
    const r = await admin.request({
      url: '/admin/user',
      method: 'post',
      send: {
        ...userData,
        roles: [...userData.roles, UserRoles.Admin],
      },
      expect: 201,
    });

    const admins = await admin.request({
      url: '/admin/admin-users',
      method: 'get',
      expect: 200,
    });

    expect(admins.body).toHaveLength(2);
  });

  it('update user', async () => {
    const newUser = await admin.request({
      url: '/admin/user',
      method: 'post',
      send: userData,
      expect: 201,
    });

    const newRoles = [...userData.roles, 'Admin'];

    const updateUserResponse = await admin.request({
      url: '/admin/user/' + newUser.body._id,
      method: 'patch',
      send: {
        roles: newRoles,
        password: 'the-new-password',
      },
      expect: 200,
    });

    const updatedUserFromDataase = await models.userModel.findOne({
      _id: updateUserResponse.body._id,
    });

    expect(updateUserResponse.body.roles.toString()).toBe(newRoles.toString());
    expect(updatedUserFromDataase.roles.toString()).toBe(newRoles.toString());
  });

  it('get users', async () => {
    for (let i = 0; i < 10; i++) {
      const user = new UserActions(app);

      await user.register();
    }

    const r = await admin.request({
      url: '/admin/user',
      method: 'get',
      query: {
        limit: 11,
      },
    });

    expect(r.body.users).toHaveLength(11);
    expect(r.body.users[0].password).toBeUndefined();
  });

  it('get user by ID', async () => {
    const user = new UserActions(app);

    await user.register();

    const r = await admin.request({
      url: '/admin/user/' + user.data._id,
      method: 'get',
      expect: 200,
    });

    expect(r.body.email).toBe(user.email.toLowerCase());
    expect(r.body.password).toBeUndefined();
  });

  describe('Other cases', () => {
    test('regular Admin can not create other admins', async () => {
      const admin = new UserActions(app);

      await admin.register();

      await models.userModel.updateOne(
        {
          _id: admin.data._id,
        },
        {
          roles: ['Player', 'Admin'],
        },
      );

      await admin.login();

      const user = new UserActions(app);

      await user.register();

      const r = await admin.request({
        url: '/admin/user/' + user.data._id,
        method: 'patch',
        send: {
          roles: ['Player', 'Admin'],
        },
        expect: 400,
      });

      expect(r.body.message).toBe('Only MasterAdmin can make other admins');
    });

    test('impossible to create MasterAdmin', async () => {
      const user = new UserActions(app);

      const r = await admin.request({
        url: '/admin/user',
        method: 'post',
        send: {
          user_email: user.email,
          password: user.password,
          roles: ['Player', 'Admin', 'MasterAdmin'],
        },
        expect: 400,
      });
    });

    test('only MasterAdmin can make other admins when creating new user', async () => {
      const regularAdmin = new UserActions(app);

      await regularAdmin.register();

      await models.userModel.updateOne(
        {
          _id: regularAdmin.data._id,
        },
        {
          roles: ['Player', 'Admin'],
        },
      );

      await regularAdmin.login();

      const user = new UserActions(app);

      const r = await regularAdmin.request({
        url: '/admin/user',
        method: 'post',
        send: {
          ...user.credentials,
          roles: ['Player', 'Admin'],
        },
        expect: 400,
      });

      expect(r.body.message).toBe('Only MasterAdmin can make other admins');

      const r2 = await admin.request({
        url: '/admin/user',
        method: 'post',
        send: {
          ...user.credentials,
          roles: ['Player', 'Admin'],
        },
        expect: 201,
      });
    });

    test('userda not exists user', async () => {
      const r = await admin.request({
        url: '/admin/user/647725b710ebef846409704a',
        method: 'patch',
        send: {
          roles: ['Player', 'Admin'],
        },
        expect: 400,
      });

      expect(r.body.message).toBe('User not exists');
    });

    test('disable canLogin change for other admins', async () => {
      const admin2 = new UserActions(app);

      await admin2.register();

      await models.userModel.updateOne(
        {
          _id: admin2.data._id,
        },
        {
          roles: ['Player', 'Admin'],
        },
      );

      await admin2.login();
    });

    it('get users with pagination', async () => {
      for (let i = 0; i < 10; i++) {
        const user = new UserActions(app);

        await user.register();
      }

      const r = await admin.request({
        url: '/admin/user',
        method: 'get',
        query: {
          page: 2,
        },
      });

      expect(r.body.users).toHaveLength(1);
    });

    test('try to get users with bad page and limit queries', async () => {
      const r = await admin.request({
        url: '/admin/user',
        method: 'get',
        query: {
          page: 'new',
          limit: 'york',
        },
      });

      expect(r.body.message[0]).toBe(
        'limit must be a number conforming to the specified constraints',
      );
      expect(r.body.message[1]).toBe(
        'page must be a number conforming to the specified constraints',
      );
    });

    test("get user with not exists user's ID", async () => {
      const r = await admin.request({
        url: '/admin/user/647776a44e4aebd58afc26d9',
        method: 'get',
        expect: 404,
      });

      expect(r.body.message).toBe('User is not exists');
    });

    test('get user with wrong ID', async () => {
      const r = await admin.request({
        url: '/admin/user/bad-id',
        method: 'get',
        expect: 400,
      });

      expect(r.body.message).toBe('Bad "_id" param');
    });

    test('only MasterAdmin can change canLogin property for other admins', async () => {
      const regularAdmin = new UserActions(app);

      await regularAdmin.register();

      await models.userModel.updateOne(
        {
          _id: regularAdmin.data._id,
        },
        {
          roles: ['Player', 'Admin'],
        },
      );

      await regularAdmin.login();

      const user = new UserActions(app);

      await user.register();

      await models.userModel.updateOne(
        {
          _id: user.data._id,
        },
        {
          roles: ['Player', 'Admin'],
        },
      );

      await user.login();

      const r = await regularAdmin.request({
        url: `/admin/user/${user.data._id}`,
        method: 'patch',
        send: {
          canLogin: false,
        },
        expect: 400,
      });

      expect(r.body.message).toBe(
        'You can not change `canLogin` for other admins',
      );

      await admin.request({
        url: `/admin/user/${user.data._id}`,
        method: 'patch',
        send: {
          canLogin: false,
        },
        expect: 200,
      });
    });

    test('send request to protected endpoint without auth header', async () => {
      const r = await request(app).get('/admin/user');

      expect(r.body.message).toBe('Unauthorized');
    });

    test('send request to protected endpoint without required rights', async () => {
      const r = await request(app)
        .get('/admin/user')
        .set('Authorization', 'some-value')
        .expect(401);

      expect(r.body.message).toBe('Unauthorized');
    });
  });
});
