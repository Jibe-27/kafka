import { KafkaClient, Producer } from 'kafka-node';

const client = new KafkaClient({ kafkaHost: 'kafka:29092' });
const producer = new Producer(client);

producer.on('ready', () => {
    console.log('Producer is ready');
});

producer.on('error', (err) => {
    console.error('Producer error:', err);
});

export function sendEvent(topic: string, message: any) {
    const payloads = [{ topic: topic, messages: JSON.stringify(message), partition: 0 }];
    producer.send(payloads, (err, data) => {
        if (err) {
            console.error(`topic ${topic}:`, err);
        } else {
            console.log(`topic ${topic}:`, data);
        }
    });
}
