/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
'use strict';
const _ = require('lodash');
// const { PubSub } = require('@google-cloud/pubsub');

// const pubSubClient = new PubSub();
// const batchPublisher = pubSubClient.topic(topicName, {
//     messageOrdering: true,
//     batching: {
//         maxMessages: maxMessages,
//         maxMilliseconds: maxWaitTime * 1000,
//     },
// });

const splitedData = _.chunk(Array.from(Array(50).keys()), 10);

splitedData.map(data => console.log(data))

/* eslint-disable prettier/prettier */
// for (let i = 0; i < 10000; i++) {
//     (async() => {

//         let content = data + i;
//         const dataBuffer = Buffer.from(content);
//         let orderingKey = 'hello' + i;
//         const message = {
//             data: dataBuffer,
//             orderingKey,
//         };
//         console.log('Try to send message sent:' + i + '>');
//         const messageId = await batchPublisher.publishMessage(message);
//         console.log('message sent:' + i + '>' + messageId);
//     })();
// }


// const limit = pLimit(10);
// const input = Array.from(Array(10000).keys()).map(async i => {
//     let content = data + i;
//     const dataBuffer = Buffer.from(content);
//     let orderingKey = 'hello' + i;
//     const message = {
//         data: dataBuffer,
//         orderingKey,
//     };
//     return limit(() => {
//         console.log('Try to send message sent:' + i + '>')
//         return batchPublisher.publishMessage(message);
//     })
// });
// // Only one promise is run at once
// const result = await Promise.all(input);
// console.log(result);