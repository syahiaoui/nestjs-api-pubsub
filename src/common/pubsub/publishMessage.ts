import { PubSub, PublishOptions } from '@google-cloud/pubsub';
import * as grpc from '@grpc/grpc-js';

import { OperationEntity } from '../../operations/entities/operation.entity';
import { AppConfiguration } from '../../config/app.configuration';

const pubSubClient = new PubSub({ grpc });
const config = new AppConfiguration();

export async function publishMessageWithCustomAttributes(
  data: OperationEntity,
): Promise<[string]> {
  const topicName = (await config.getPubsubConfig()).topic;
  const publishOptions: PublishOptions = { messageOrdering: true };
  const message = {
    data: Buffer.from(JSON.stringify(data)),
    orderingKey: data.key,
    messageId: data.processId,
    attributes: {
      eventType: data.operationType,
      topic: topicName,
      clientId: (await config.getPubsubConfig()).clientId,
    },
  };
  return pubSubClient.topic(topicName, publishOptions).publishMessage(message);
}
