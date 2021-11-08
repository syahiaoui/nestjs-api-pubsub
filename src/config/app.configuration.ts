import * as dotenv from 'dotenv';

interface StringMap {
  [key: string]: string;
}

export class AppConfiguration {
  private readonly envConfig: Record<string, string>;
  constructor() {
    const result = dotenv.config();

    if (result.error) {
      this.envConfig = process.env;
    } else {
      this.envConfig = result.parsed;
    }
  }

  public get(key: string): string {
    return this.envConfig[key];
  }

  public async getPortConfig(): Promise<number> {
    return parseInt(this.get('PORT'));
  }

  public async getPubsubConfig(): Promise<StringMap> {
    return {
      topic: this.get('PUBSUB_TOPIC_INPUT_DATA'),
      clientId: this.get('PUBSUB_CLIENT_ID'),
      messageOrdering: this.get('PUBSUB_ENABLE_MESSAGE_ORDERING'),
      messageRetentionDuration: this.get(
        'PUBSUB_MESSAGE_RETENTION_DURATION_SECONDS',
      ),
    };
  }
}
