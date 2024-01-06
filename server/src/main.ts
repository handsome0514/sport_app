import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.enableCors({
    credentials: true,
    origin: [
      'http://localhost:8000',
      'http://localhost:3000',
      'http://localhost:3001',
      'https://subsoccer-staging-client-pnl2gmkxja-lz.a.run.app',
      'https://alpha.subsoccer.app',
      'https://subsoccer.app',
      'https://dev.subsoccer.app',
    ],
  });
  app.use(cookieParser());

  logger.log('Setup middlewares');

  // Setup swagger
  const config = new DocumentBuilder()
    .setTitle('Subsoccer')
    .setDescription('Sub soccer API documentation')
    .setVersion('1.0.0')
    .addSecurity('Bearer', {
      type: 'http',
      scheme: 'Bearer',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  logger.log('Setup swagger');

  const configService = app.get(ConfigService);
  const PORT_API = configService.get('PORT_API');

  logger.log(`Run server on the ${PORT_API} port`);

  await app.listen(PORT_API);
}

bootstrap();
