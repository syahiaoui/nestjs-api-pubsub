'use strict';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfiguration } from './config/app.configuration';
import { setImmediate } from 'timers/promises';
import { createTopic } from './common/pubsub/createTopic';

async function bootstrap() {
  const config = new AppConfiguration();
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  await setImmediate(createTopic());
  app.setGlobalPrefix(config.get('API_PREFIX') || 'api');
  await app.listen((await config.getPortConfig()) || 3000);
}
bootstrap();
