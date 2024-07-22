const amqp = require('amqplib');
const schedule = require('node-schedule');

const QUEUE = 'notifications';

// Function to send messages to RabbitMQ
async function sendNotification(message) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE, { durable: true });
        channel.sendToQueue(QUEUE, Buffer.from(message), { persistent: true });
        console.log(" [x] Sent %s", message);
        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error("Error sending notification:", error);
    }
}

// Function to schedule notifications
function scheduleNotification() {
    const now = new Date();
    const fewMinutesAfter = new Date(now.getTime() + 2 * 60 * 1000);  // 2 minutes from now
    const tenMinutesAfter = new Date(now.getTime() + 10 * 60 * 1000);  // 10 minutes from now

    schedule.scheduleJob(fewMinutesAfter, () => {
        sendNotification('Notification: Few minutes after');
    });

    schedule.scheduleJob(tenMinutesAfter, () => {
        sendNotification('Notification: 10 minutes after');
    });

    console.log("Notifications scheduled for few minutes and 10 minutes after from now");
}

// Schedule notifications
scheduleNotification();
