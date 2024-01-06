import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { config } from '../../src/config/configuration';

test('default port', async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  config();
});

test('use default portApi value', async () => {
  delete process.env.PORT_API;

  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  config();
});

test('without required env variables', () => {
  try {
    delete process.env.DB_CONNECT;

    config();

    throw new Error('Expected to catch an error');
  } catch (e) {
    expect(e.message).toBe('DB_CONNECT env variable is required');
  }
});
