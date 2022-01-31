'use strict';
import { PubSub, PublishOptions } from '@google-cloud/pubsub';
import * as grpc from '@grpc/grpc-js';

import { OperationEntity } from '../../operations/entities/operation.entity';
import { AppConfiguration } from '../../config/app.configuration';

export const pubSubClient: PubSub = new PubSub({ grpc });
const config = new AppConfiguration();

export async function publishMessageWithCustomAttributes(
  data: OperationEntity,
): Promise<[string]> {
  const pubsubConfig: Record<string, string> = await config.getPubsubConfig();
  const topicName: string = pubsubConfig.topic;
  const publishOptions: PublishOptions = {
    messageOrdering: Boolean(pubsubConfig.messageOrdering),
  };

  const message = {
    data: Buffer.from(JSON.stringify(data)),
    orderingKey: data.key,
    messageId: data.processId,
    attributes: {
      eventType: data.operationType,
      key: data.key,
      processDate: data.processDate,
      processId: data.processId,
      topic: topicName,
      clientId: pubsubConfig.clientId,
    },
  };
  console.log('>>>message: ', JSON.stringify(data));

  return pubSubClient.topic(topicName, publishOptions).publishMessage(message);
}
