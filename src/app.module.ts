'use strict';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OperationsModule } from './operations/operations.module';
import { AppConfiguration } from './config/app.configuration';
import { LoggerMiddleware } from './middleware/Logger.middleware';

@Module({
  imports: [OperationsModule, AppConfiguration],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
