import type { Application } from 'express';
import * as request from 'supertest';

import { UserDocument } from '../../src/user/schemas/user.schema';
import { getCookies } from './get-cookies.util';
import { randomString } from './random.util';

interface RequestI {
  url: string;
  method: 'get' | 'patch' | 'delete' | 'post';
  query?: Record<string, any>;
  send?: any;
  expect?: number;
}

// List of emails to generate unique emails
const emails = new Set();

export class UserActions {
  private readonly app: Application;
  private readonly _password: string;
  private readonly _email: string;

  constructor(
    app: Application,
    options?: {
      email?: string;
      username?: string;
      password?: string;
    },
  ) {
    this.app = app;

    this._email = options?.email || UserActions.generateEmail();

    this._password = options?.password || UserActions.generatePassword();
  }

  private _refreshToken: string;

  get refreshToken() {
    return this._refreshToken;
  }

  set refreshToken(token: string) {
    this._refreshToken = token;
  }

  private _accessToken: string;

  get accessToken() {
    return this._accessToken;
  }

  set accessToken(token: string) {
    this._accessToken = token;
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }

  private _data: UserDocument;

  get data() {
    if (!this._data) {
      throw new Error("User doesn't defined");
    }

    return this._data;
  }

  get credentials() {
    return {
      user_email: this.email,
      password: this.password,
    };
  }

  static async getUser(app: Application, refreshToken: string, expect = 200) {
    const response = await request(app)
      .get(`/user/refresh`)
      .set('Cookie', ['refreshToken=' + refreshToken])
      .expect(expect);

    return response?.body?.user;
  }

  static async request(
    app: Application,
    {
      url,
      method,
      query,
      send,
      expect,
      refreshToken,
      accessToken,
    }: RequestI & { refreshToken?: string; accessToken?: string },
  ) {
    if (expect) {
      return request(app)
        [method](url)
        .set({ Authorization: 'Bearer ' + accessToken })
        .set('Cookie', [`refreshToken=${refreshToken}`])
        .query(query)
        .send(send)
        .expect(expect);
    }

    return request(app)
      [method](url)
      .set({ Authorization: 'Bearer ' + accessToken })
      .set('Cookie', [`refreshToken=${refreshToken}`])
      .query(query)
      .send(send);
  }

  static generateEmail() {
    let email = randomString(10) + '@' + randomString(10) + '.com';

    while (emails.has(email)) {
      email = randomString(10) + '@' + randomString(10) + '.com';
    }

    return email;
  }

  static generatePassword() {
    return randomString(10);
  }

  async register() {
    await request(this.app)
      .post('/user/registration')
      .send({
        user_email: this.email,
        password: this.password,
      })
      .expect(201);

    await this.login();
  }

  async login() {
    const login = await request(this.app)
      .post('/user/login')
      .send({
        user_email: this.email,
        password: this.password,
      })
      .expect(201);

    const cookies = getCookies(login);

    this._accessToken = login.body.accessToken;
    this._refreshToken = cookies.refreshToken.value;

    await this.getUser();
  }

  async refresh(expect?: number) {
    const r = await this.request({
      url: '/user/refresh',
      method: 'get',
      expect,
    });

    this.accessToken = r.body.accessToken;
    this._data = r.body.user;

    return r;
  }

  async getUser(expect?: number) {
    const getUserResponse = await UserActions.getUser(
      this.app,
      this.refreshToken,
      expect,
    );

    if (!getUserResponse) {
      throw new Error("Couldn't get user");
    }

    this._data = getUserResponse;

    return this.data;
  }

  async request({ url, method, query, send, expect }: RequestI) {
    if (expect) {
      return request(this.app)
        [method](url)
        .set({ Authorization: 'Bearer ' + this._accessToken })
        .set('Cookie', ['refreshToken=' + this._refreshToken])
        .query(query)
        .send(send)
        .expect(expect);
    }

    return request(this.app)
      [method](url)
      .set({ Authorization: 'Bearer ' + this._accessToken })
      .set('Cookie', ['refreshToken=' + this._refreshToken])
      .query(query)
      .send(send);
  }
}
