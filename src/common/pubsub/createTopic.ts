'use strict';
import { PubSub } from '@google-cloud/pubsub';
import * as grpc from '@grpc/grpc-js';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { AppConfiguration } from 'src/config/app.configuration';

const pubSubClient = new PubSub({ grpc });
const config = new AppConfiguration();
const PUBSUB_RESOURCE_ALREADY_EXISTS_CODE = 6;

export async function createTopic() {
  const pubsubConfig: Record<string, string> = await config.getPubsubConfig();
  const topicName: string = pubsubConfig.topic;
  try {
    await pubSubClient.createTopic({
      name: topicName,
      messageRetentionDuration: {
        seconds: pubsubConfig.messageRetentionDuration,
      },
    });
    Logger.log(`[createTopic] - Topic ${topicName} created.`);
  } catch (error) {
    if (error && error.code === PUBSUB_RESOURCE_ALREADY_EXISTS_CODE) {
      return Logger.log(`[createTopic] - Topic ${topicName} already exists.`);
    }
    throw new InternalServerErrorException({
      describe: `Some error occured whene creating the pubsub topic: ${topicName}`,
    });
  }
}
