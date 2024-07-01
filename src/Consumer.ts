import { KafkaClient, Consumer, Message, ConsumerOptions } from 'kafka-node';

const client = new KafkaClient({ kafkaHost: 'kafka:29092' });
const consumerOptions: ConsumerOptions = {
    autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: 'utf8',
    fromOffset: false
};

const consumerEntry = new Consumer(client, [{ topic: 'entry-events', partition: 0 }], consumerOptions);
const consumerExit = new Consumer(client, [{ topic: 'exit-events', partition: 0 }], consumerOptions);

let entryEvents: any[] = [];
let exitEvents: any[] = [];

consumerEntry.on('message', (message: Message) => {
    entryEvents.push(JSON.parse(message.value.toString()));
});

consumerExit.on('message', (message: Message) => {
    exitEvents.push(JSON.parse(message.value.toString()));
});

consumerEntry.on('error', (err) => {
});

consumerExit.on('error', (err) => {
});

process.on('SIGINT', () => {
    consumerEntry.close(true, () => {
        process.exit();
    });
    consumerExit.close(true, () => {
        process.exit();
    });
});

export { entryEvents, exitEvents };
