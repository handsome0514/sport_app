import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import type { Application } from 'express';
import { connect, connection } from 'mongoose';

import { AppModule } from '../../src/app.module';
import { getModels, IModels } from '../utils/get-models.util';
import { UserActions } from '../utils/user-action.util';
import { makeNotExistsID } from '../utils/uuit.util';

async function createTournament(
  user: UserActions,
  data: Record<string, unknown>,
  expect?: number,
) {
  if (expect) {
    return user.request({
      url: '/tournaments',
      method: 'post',
      send: data,
      expect,
    });
  }

  return user.request({
    url: '/tournaments',
    method: 'post',
    send: data,
  });
}

describe('Tournaments (e2e)', () => {
  let module: TestingModule;
  let app: Application;
  let application: INestApplication;
  let models: IModels;
  let user: UserActions;
  let data;

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

    user = new UserActions(app);

    await user.register();

    const date = new Date();

    date.setDate(date.getDate() + 1);

    data = {
      creator: user.data._id.toString(),
      name: 'Test',
      date: date.toString(),
      place: 'Lviv',
      additional: '',
      participants: 4,
      rules: 'classic',
      playtime: '',
      drafts: false,
      classic: true,
      tournament_bracket: [[]],
    };
  });

  afterAll(async () => {
    await connection.close();
  });

  it('create tournament', async () => {
    expect(await models.tournamentModel.find().lean()).toHaveLength(0);

    const r = await user.request({
      url: '/tournaments',
      method: 'post',
      send: data,
      expect: 201,
    });

    expect(await models.tournamentModel.find().lean()).toHaveLength(1);
  });

  it('get tournament by id', async () => {
    const r = await createTournament(user, data, 201);

    const { body } = await UserActions.request(app, {
      url: '/tournaments/' + r.body._id,
      method: 'get',
      expect: 200,
    });

    expect(body).toBeTruthy();
  });

  it('get tournament by id', async () => {
    const r = await createTournament(user, data, 201);

    const { body } = await UserActions.request(app, {
      url: '/tournaments/' + r.body._id,
      method: 'get',
      expect: 200,
    });
  });

  it('get won tournaments', async () => {
    await createTournament(user, data, 201);

    const { body } = await user.request({
      url: '/tournaments',
      method: 'get',
      expect: 200,
    });

    expect(body.tournaments).toHaveLength(1);
  });

  it('delete tournament by id', async () => {
    const tournament = await createTournament(user, data, 201);

    const { body } = await user.request({
      url: '/tournaments/' + tournament.body._id,
      method: 'delete',
      expect: 200,
    });
  });

  it('get tournaments by sharing id', async () => {
    const newTournament = await createTournament(user, data);

    await user.request({
      url: '/tournaments/' + newTournament.body._id,
      method: 'patch',
      send: {
        drafts: false,
        started: true,
        started_at: new Date().toString(),
      },
      expect: 200,
    });

    const anotherUser = new UserActions(app);

    await anotherUser.register();

    const r = await anotherUser.request({
      url: '/tournaments/join',
      method: 'get',
      query: {
        sharingId: user.data.sharingId,
      },
    });

    expect(r.body).toHaveLength(1);
  });

  it('get tournament link by code', async () => {
    await createTournament(user, data, 201);

    const tournaments = await user.request({
      url: '/tournaments',
      method: 'get',
      expect: 200,
    });

    const anotherUser = new UserActions(app);

    await anotherUser.register();

    const r = await anotherUser.request({
      url: `/tournaments/code/${tournaments.body.tournaments[0].code_link}`,
      method: 'get',
      expect: 200,
    });
  });

  it('add players to exists tournament', async () => {
    await createTournament(user, data);

    const tournaments = await user.request({
      url: '/tournaments',
      method: 'get',
      expect: 200,
    });

    const r = await user.request({
      url: '/tournaments/add-players',
      method: 'post',
      send: {
        _id: tournaments.body.tournaments[0]._id,
        nickname: 'mike',
        user: {},
        team: 'red',
      },
      expect: 201,
    });

    expect(r.body.players).toHaveLength(1);
    expect(r.body.players[0].name).toBe('mike');
    expect(r.body.players[0].team).toBe('red');
  });

  describe('other cases', () => {
    test('get tournament with invalid id', async () => {
      await createTournament(user, data, 201);

      const { body, status } = await UserActions.request(app, {
        url: '/tournaments/bad-id',
        method: 'get',
        expect: 400,
      });

      expect(body.message).toBe('Invalid _id');
    });

    test('get tournament with not exists id', async () => {
      const r = await createTournament(user, data, 201);

      const { body, status } = await UserActions.request(app, {
        url: '/tournaments/' + user.data._id,
        method: 'get',
        expect: 400,
      });

      expect(body.message).toBe('Tournament not exists');
    });

    test('get tournaments with bad sharing ID', async () => {
      const r = await user.request({
        url: '/tournaments/join',
        method: 'get',
        query: { sharingId: 'the-bad-one' },
        expect: 400,
      });

      expect(r.body.message).toBe('Bad sharing ID');
    });

    test('joint tournament with bad code', async () => {
      const r = await user.request({
        url: `/tournaments/code/the-bad-one`,
        method: 'get',
        expect: 400,
      });

      expect(r.body.message).toBe('Tournament not exists');
    });

    test('update tournament with bad id', async () => {
      await createTournament(user, data, 201);

      const tournaments = await user.request({
        url: '/tournaments',
        method: 'get',
      });

      const tournamentId = tournaments.body.tournaments[0]._id;

      const r = await user.request({
        url: `/tournaments/${makeNotExistsID(tournamentId)}`,
        method: 'patch',
        send: {
          started: false,
          drafts: true,
        },
        expect: 400,
      });

      expect(r.body.message).toBe('Tournament not exists');

      const r2 = await user.request({
        url: '/tournaments/the-bad-one',
        method: 'patch',
        send: {
          started: false,
          drafts: true,
        },
        expect: 400,
      });

      expect(r2.body.message).toBe('Tournament not exists');
    });

    test('add player to not exists tournament', async () => {
      await createTournament(user, data);

      const tournaments = await user.request({
        url: '/tournaments',
        method: 'get',
        expect: 200,
      });

      const r = await user.request({
        url: '/tournaments/add-players',
        method: 'post',
        send: {
          _id: makeNotExistsID(tournaments.body.tournaments[0]._id),
          nickname: 'mike',
          user: {},
          team: 'red',
        },
        expect: 400,
      });

      expect(r.body.message).toBe('Tournament not exists');
    });

    test('add duplicated player', async () => {
      await createTournament(user, data);

      const tournaments = await user.request({
        url: '/tournaments',
        method: 'get',
        expect: 200,
      });

      await user.request({
        url: '/tournaments/add-players',
        method: 'post',
        send: {
          _id: tournaments.body.tournaments[0]._id,
          nickname: 'mike',
          user: {},
          team: 'red',
        },
        expect: 201,
      });

      const r = await user.request({
        url: '/tournaments/add-players',
        method: 'post',
        send: {
          _id: tournaments.body.tournaments[0]._id,
          nickname: 'mike',
          user: {
            nickname: 'micheal',
          },
        },
        expect: 400,
      });

      expect(r.body.message).toBe('User already is player');
    });

    test('delete tournament with invalid id', async () => {
      const r = await user.request({
        url: `/tournaments/the-bad-one`,
        method: 'delete',
        expect: 400,
      });

      expect(r.body.message).toBe('Invalid _id');
    });

    test('delete not exists tournament', async () => {
      await createTournament(user, data);

      const tournaments = await user.request({
        url: '/tournaments',
        method: 'get',
        expect: 200,
      });

      const r = await user.request({
        url: `/tournaments/${makeNotExistsID(
          tournaments.body.tournaments[0]._id,
        )}`,
        method: 'delete',
        expect: 400,
      });

      expect(r.body.message).toBe('Tournament not exists');
    });

    test('delete tournament which not belongs to the user', async () => {
      const anotherUser = new UserActions(app);

      await anotherUser.register();

      await createTournament(user, data);

      const tournaments = await user.request({
        url: '/tournaments',
        method: 'get',
        expect: 200,
      });

      const r = await anotherUser.request({
        url: `/tournaments/${tournaments.body.tournaments[0]._id}`,
        method: 'delete',
        expect: 400,
      });

      expect(r.body.message).toBe('This tournament is not belongs to you');
    });
  });
});
