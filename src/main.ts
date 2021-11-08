'use strict';
import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { AppConfiguration } from './config/app.configuration';
import { setImmediate } from 'timers/promises';
import { createTopic } from './common/pubsub/createTopic';
import { pubSubClient } from './common/pubsub/publishMessage';

const onShutdown = (shutdownSleepMs: number, app: INestApplication): void[] => {
  const signalTraps: string[] = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
  const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));
  return signalTraps.map((type) => {
    process.once(type, async () => {
      try {
        Logger.log(
          `[bootstrap] - Received ${type}, closing nest and PubSub ...`,
        );
        await app.close();
        await pubSubClient.close();
        await sleep(shutdownSleepMs);
      } finally {
        process.exit(0);
      }
    });
  });
};

async function bootstrap() {
  const config = new AppConfiguration();
  const app: INestApplication = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  await setImmediate(createTopic());
  //app.enableShutdownHooks(); // wa can starts listening for shutdown hooks but they consumes memory: https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown
  app.setGlobalPrefix(config.get('API_PREFIX') || 'api');
  await app.listen((await config.getPortConfig()) || 3000);
  onShutdown(80000, app);
}
bootstrap();
