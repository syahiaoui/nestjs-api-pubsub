'use strict';
import { PubSub } from '@google-cloud/pubsub';
import * as grpc from '@grpc/grpc-js';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { AppConfiguration } from 'src/config/app.configuration';

const pubSubClient = new PubSub({ grpc });
const config = new AppConfiguration();
const PUBSUB_RESOURCE_ALREADY_EXISTS_CODE = 6;

export async function createSubscription(): Promise<void> {
  const pubsubConfig: Record<string, string> = await config.getPubsubConfig();
  const subscriptionName: string = pubsubConfig.subscription;
  const topicName: string = pubsubConfig.topic;
  try {
    // Creates a new subscription
    await pubSubClient
      .topic(pubsubConfig.topic)
      .createSubscription(subscriptionName, {
        retryPolicy: {
          minimumBackoff: {
            seconds: 20,
          },
          maximumBackoff: {
            seconds: 60,
          },
        },
      });
    Logger.log(`[createTopic] - Subscription ${subscriptionName} created.`);
  } catch (error) {
    console.log(error);
    if (error && error.code === PUBSUB_RESOURCE_ALREADY_EXISTS_CODE)
      Logger.log(
        `[createTopic] - Subscription ${subscriptionName} already exists for Topic ${topicName}.`,
      );
    else
      throw new InternalServerErrorException({
        error,
        describe: `Some error occured whene creating the pubsub Subscription ${subscriptionName} for Topic ${topicName}`,
      });
  }
}

export async function createTopic(): Promise<void> {
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
    await createSubscription();
  } catch (error) {
    if (error && error.code === PUBSUB_RESOURCE_ALREADY_EXISTS_CODE)
      Logger.log(`[createTopic] - Topic ${topicName} already exists.`);
    else
      throw new InternalServerErrorException({
        error,
        describe: `Some error occured whene creating the pubsub topic ${topicName}`,
      });
  }
}
