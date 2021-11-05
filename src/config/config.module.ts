import { Global, Module } from '@nestjs/common';

import { AppConfiguration } from './app.configuration';

@Global()
@Module({
  providers: [
    {
      provide: AppConfiguration,
      useValue: new AppConfiguration(),
    },
  ],
  exports: [AppConfiguration],
})
export class ConfigModule {}
