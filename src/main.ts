'use strict';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfiguration } from './config/app.configuration';

async function bootstrap() {
  const config = new AppConfiguration();
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  app.setGlobalPrefix(config.get('API_PREFIX') || 'api');
  await app.listen((await config.getPortConfig()) || 3000);
}
bootstrap();
