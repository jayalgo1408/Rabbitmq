const amqp = require('amqplib');

const QUEUE = 'notifications';

async function consumeNotifications() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE, { durable: true });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", QUEUE);
        
        channel.consume(QUEUE, (msg) => {
            if (msg !== null) {
                console.log(" [x] Received %s", msg.content.toString());
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Error consuming notifications:", error);
    }
}

consumeNotifications();
