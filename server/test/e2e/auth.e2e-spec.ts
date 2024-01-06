import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import type { Application } from 'express';
import { connect, connection } from 'mongoose';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';
import { JwtTokenService } from '../../src/auth/services/jwt-token.service';
import { UserRoles } from '../../src/user/schemas/user.schema';
import { getCookies } from '../utils/get-cookies.util';
import { getModels, IModels } from '../utils/get-models.util';
import { sleep } from '../utils/sleep.util';
import { UserActions } from '../utils/user-action.util';

describe('AppController (e2e)', () => {
  let module: TestingModule;
  let app: Application;
  let application: INestApplication;
  let configService: ConfigService;
  let models: IModels;
  let jwtService: JwtService;
  let jwtTokenService: JwtTokenService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    application = await module
      .createNestApplication()
      .use(cookieParser())
      .useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
      .init();

    app = application.getHttpServer();

    configService = application.get(ConfigService);

    await connect(configService.get('dbConnection'));

    models = getModels(application);
    jwtService = module.get<JwtService>(JwtService);
    jwtTokenService = module.get<JwtTokenService>(JwtTokenService);
  });

  beforeEach(async () => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  const user = {
    user_email: 'some@mail.com',
    password: '1111',
    refreshToken: '',
    accessToken: '',
  };

  it('register user', async () => {
    await request(app).post('/user/registration').send(user).expect(201);

    const users = await models.userModel.find();

    expect(users).toHaveLength(1);
    expect(users[0].email).toBe(user.user_email);
  });

  it('log-in user', async () => {
    await request(app).post('/user/registration').send(user).expect(201);

    const r = await request(app).post('/user/login').send(user).expect(201);

    const cookies = getCookies(r);

    expect(r.body.accessToken).toBeTruthy();
    expect(cookies.refreshToken.value).toBeTruthy();
    expect(cookies.refreshToken.HttpOnly).toBeTruthy();

    const tokens = await models.tokenModel.find();

    expect(tokens).toHaveLength(1);
    expect(tokens[0].refreshToken).toBe(cookies.refreshToken.value);
  });

  it('log-out user', async () => {
    await request(app).post('/user/registration').send(user).expect(201);

    const r = await request(app).post('/user/login').send(user).expect(201);

    const cookies = getCookies(r);

    await request(app)
      .post('/user/logout')
      .set('Cookie', ['refreshToken=' + cookies.refreshToken.value])
      .expect(201);

    const tokens = await models.tokenModel.find();

    expect(tokens).toHaveLength(0);
  });

  it('refresh tokens', async () => {
    await request(app).post('/user/registration').send(user).expect(201);

    const r = await request(app).post('/user/login').send(user).expect(201);

    const tokensBefore = await models.tokenModel.find();

    const firstCookies = getCookies(r);

    await sleep(1000);

    const response = await request(app)
      .get('/user/refresh')
      .set('Cookie', ['refreshToken=' + firstCookies.refreshToken.value])
      .expect(200);

    const secondCookies = getCookies(response);

    expect(response.body.accessToken).toBeTruthy();
    expect(secondCookies.refreshToken.value).toBeTruthy();
    expect(secondCookies.refreshToken.HttpOnly).toBeTruthy();

    const tokensAfter = await models.tokenModel.find();

    expect(tokensAfter).toHaveLength(1);
    expect(tokensAfter[0].refreshToken).not.toBe(tokensBefore[0].refreshToken);
    expect(tokensAfter[0].refreshToken).toBe(secondCookies.refreshToken.value);
  });

  it('update user data', async () => {
    await request(app).post('/user/registration').send(user).expect(201);

    const data = {
      email: 'new@mail.com',
      name: 'Josh A',
      nickname: 'joshA',
      phone: '+380980888123',
    };

    const loginResponse = await request(app)
      .post('/user/login')
      .send(user)
      .expect(201);

    await request(app)
      .patch('/user')
      .send(data)
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
      .expect(200);

    const updatedUser = await models.userModel.findOne();

    expect(data.email).toBe(updatedUser.email);
    expect(data.name).toBe(updatedUser.name);
    expect(data.nickname).toBe(updatedUser.nickname);
    expect(data.phone).toBe(updatedUser.phone);
  });

  it('activate user profile', async () => {
    const user = new UserActions(app);

    await user.register();

    const userFromDb = await models.userModel.findOne();

    const r = await request(app)
      .get('/user/activate')
      .query({
        link: userFromDb.activationLink,
      })
      .expect(200);

    expect(r.body.message).toBe('Account activated');
  });

  it.todo('make request to change password');

  it.todo('change password');

  describe('Other cases', () => {
    test('protected endpoints', async () => {
      await request(app).patch('/user').expect(401);
    });

    test('protected endpoint with true and fake tokens', async () => {
      await request(app).post('/user/registration').send(user).expect(201);

      const dbUser = await models.userModel.findOne();

      // With fake secret
      const token = jwtService.sign(
        {
          _id: dbUser._id,
        },
        {
          secret: 'wrong-one',
          expiresIn: '15m',
        },
      );

      await request(app)
        .patch('/user')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);

      // Try with true secret
      const trueToken = jwtService.sign(
        {
          _id: dbUser._id,
        },
        {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          expiresIn: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN, 10),
        },
      );

      await request(app)
        .patch('/user')
        .set('Authorization', `Bearer ${trueToken}`)
        .send({
          name: 'Josh',
        })
        .expect(200);
    });

    test('register user with already exists email', async () => {
      await request(app).post('/user/registration').send(user).expect(201);

      await request(app)
        .post('/user/registration')
        .send(user)
        .expect(400)
        .expect((r) => expect(r.body.message).toBe('Email already exists'));
    });

    test('login user with wrong password', async () => {
      await request(app).post('/user/registration').send(user).expect(201);

      await request(app)
        .post('/user/login')
        .send({
          ...user,
          password: 'wrong',
        })
        .expect(400)
        .expect(({ body }) =>
          expect(body.message).toBe('Invalid email or password'),
        );
    });

    test('update user with data which already taken', async () => {
      const user2 = {
        user_email: '2@mail.com',
        password: '12345678',
      };
      await request(app).post('/user/registration').send(user).expect(201);
      await request(app).post('/user/registration').send(user2).expect(201);

      const data = {
        email: 'new@mail.com',
        name: 'Josh A',
        nickname: 'joshA',
        phone: '+380980888123',
      };

      const loginResponse1 = await request(app)
        .post('/user/login')
        .send(user)
        .expect(201);

      const loginResponse2 = await request(app)
        .post('/user/login')
        .send(user2)
        .expect(201);

      await request(app)
        .patch('/user')
        .send(data)
        .set('Authorization', `Bearer ${loginResponse1.body.accessToken}`)
        .expect(200);

      // Test email
      await request(app)
        .patch('/user')
        .send({
          email: data.email,
        })
        .set('Authorization', `Bearer ${loginResponse2.body.accessToken}`)
        .expect(400);

      // Test phone
      await request(app)
        .patch('/user')
        .send({
          phone: data.phone,
        })
        .set('Authorization', `Bearer ${loginResponse2.body.accessToken}`)
        .expect(400);

      // Test nickname
      await request(app)
        .patch('/user')
        .send({
          nickname: data.nickname,
        })
        .set('Authorization', `Bearer ${loginResponse2.body.accessToken}`)
        .expect(400);
    });

    test('update user with not exists use _id in the token', async () => {
      await request(app).post('/user/registration').send(user).expect(201);

      const data = {
        email: 'new@mail.com',
        name: 'Josh A',
        nickname: 'joshA',
        phone: '+380980888123',
      };

      const loginResponse = await request(app)
        .post('/user/login')
        .send(user)
        .expect(201);

      const userId = loginResponse.body.user._id.toString();

      const accessToken = await jwtTokenService.generateAccessToken({
        _id:
          userId.slice(0, userId.length - 1) +
          (userId[userId.length - 1] !== 'a' ? 'a' : 'b'),
        roles: [UserRoles.Player, UserRoles.Admin],
      });

      const r = await request(app)
        .patch('/user')
        .send(data)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);

      expect(r.body.message).toBe('User not exists');

      const accessToken2 = await jwtTokenService.generateAccessToken({
        _id: 'bad-id',
        roles: [UserRoles.Player, UserRoles.Admin],
      });

      const r2 = await request(app)
        .patch('/user')
        .send(data)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(400);

      expect(r.body.message).toBe('User not exists');
    });

    test('try to login if `canLogin` is false', async () => {
      const user = new UserActions(app);

      await user.register();

      const userFromDb = await models.userModel.findOne();

      await models.userModel.updateOne(
        {
          _id: userFromDb._id,
        },
        {
          canLogin: false,
        },
      );

      const r = await request(app)
        .post('/user/login')
        .send(user.credentials)
        .expect(400);

      expect(r.body.message).toBe('You can not login');
    });

    test('try to refresh if `canLogin` is false', async () => {
      const user = new UserActions(app);

      await user.register();

      const userFromDb = await models.userModel.findOne();

      await models.userModel.updateOne(
        {
          _id: userFromDb._id,
        },
        {
          canLogin: false,
        },
      );

      const r = await user.request({
        url: '/user/refresh',
        method: 'get',
        expect: 400,
      });

      expect(r.body.message).toBe('You can not refresh tokens');
    });

    test('refresh with bad refresh token', async () => {
      const r = await request(app)
        .get('/user/refresh')
        .set('Cookie', ['refreshToken=some.token.here'])
        .expect(400);

      expect(r.body.message).toBe('Bad refresh token');
    });

    test('logout with bad refresh token', async () => {
      const user = new UserActions(app);

      await user.register();

      await sleep(1000);

      const token = await jwtTokenService.generateRefreshToken({
        _id: user.data._id.toString(),
        roles: [],
      });

      user.refreshToken = token;

      const r = await user.request({
        url: '/user/logout',
        method: 'post',
        expect: 400,
      });

      expect(r.body.message).toBe('Session not exists');
    });

    test('refresh with not exists refresh token', async () => {
      const user = new UserActions(app);

      await user.register();

      await sleep(1000);

      const token = await jwtTokenService.generateRefreshToken({
        _id: user.data._id.toString(),
        roles: [],
      });

      user.refreshToken = token;

      const r = await user.request({
        url: '/user/refresh',
        method: 'get',
        expect: 400,
      });

      expect(r.body.message).toBe('Session not exists');
    });

    test('logout with not exists refresh token', async () => {
      const r = await request(app)
        .post('/user/logout')
        .set('Cookie', ['refreshToken=some.token.here'])
        .expect(400);

      expect(r.body.message).toBe('Bad refresh token');
    });

    test('try to refresh tokens with bad _id key', async () => {
      const token = await jwtTokenService.generateRefreshToken({
        _id: 'bad-id',
        roles: [],
      });

      const user = new UserActions(app);

      await user.register();

      user.refreshToken = token;

      const r = await user.refresh();

      expect(r.body.message).toBe('Bad refresh token');
    });

    test('activate user with wrong link', async () => {
      const r = await request(app).get('/user/activate').query({
        link: 'bad-link',
      });

      expect(r.body.message).toBe('Invalid activation link');
    });
  });
});
