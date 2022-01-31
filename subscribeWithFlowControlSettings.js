/* eslint-disable prettier/prettier */
'use strict';
// Imports the Google Cloud client library
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PubSub } = require('@google-cloud/pubsub');
const pubSubClient = new PubSub();

function main() {

    const subscriptionName =
        'projects/ysamir-data-processing-test/subscriptions/output-data-sub';
    const maxInProgress = 5;
    const timeout = 10;

    // Creates a client; cache this for further use

    async function subscribeWithFlowControlSettings() {
        const subscriberOptions = {
            flowControl: {
                maxMessages: maxInProgress,
            },
        };

        // References an existing subscription.
        // Note that flow control settings are not persistent across subscribers.
        const subscription = pubSubClient.subscription(
            subscriptionName,
            subscriberOptions,
        );

        console.log(
            `Subscriber to subscription ${subscription.name} is ready to receive messages at a controlled volume of ${maxInProgress} messages.`,
        );

        const messageHandler = (message) => {
            console.log(`Received message: ${message.id}`);
            console.log(`\tData: ${message.data}`);
            console.log(`\tAttributes: ${JSON.stringify(message.attributes)}`);

            // "Ack" (acknowledge receipt of) the message
            message.ack();
        };

        subscription.on('message', messageHandler);

        // setTimeout(() => {
        //     subscription.close();
        // }, timeout * 1000);
    }

    // [END pubsub_subscriber_flow_settings]
    subscribeWithFlowControlSettings().catch(console.error);
}

main(...process.argv.slice(2));