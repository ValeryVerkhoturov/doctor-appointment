import amqp, { Connection, Channel } from 'amqplib';
import Logger from "../logger/logger";
import {env} from "../env";

interface RabbitMQConnection {
    connection: Connection;
    channel: Channel;
}

interface RabbitMQNotifierMessage {
    userPhone: string,
    message: string,
}

class Notifier {
    private static NOTIFIER_QUEUE = 'notifier_queue'
    private static NOTIFIER_EXCHANGE = 'notifier_exchange'
    private static NOTIFIER_ROUTING_KEY = 'notifier_routing_key'

    rabbitMQConnection: RabbitMQConnection | undefined;

    public async connect() {
        try {
            console.log(`amqp://${env.rabbitmqDefaultUser}:${env.rabbitmqDefaultPass}@${env.rabbitmqHost}:5672`);
            const connection = await amqp.connect(
                `amqp://${env.rabbitmqDefaultUser}:${env.rabbitmqDefaultPass}@${env.rabbitmqHost}:5672`
            );
            const channel = await connection.createChannel();
            this.rabbitMQConnection = {connection, channel}

            await this.rabbitMQConnection.channel.assertExchange(Notifier.NOTIFIER_EXCHANGE, 'x-delayed-message', {
                durable: true,
                arguments: {'x-delayed-type': "direct"}
            });
            await this.rabbitMQConnection.channel.assertQueue(Notifier.NOTIFIER_QUEUE, {
                durable: true
            })
            await this.rabbitMQConnection.channel.bindQueue(Notifier.NOTIFIER_QUEUE, Notifier.NOTIFIER_EXCHANGE, Notifier.NOTIFIER_ROUTING_KEY);

            Logger.info('Successfully connected to RabbitMQ');
        } catch (error) {
            Logger.error('Failed to connect to RabbitMQ:', error);
        }
    }

    private static getMessages(userPhone: string, userName: string, doctorFirstName: string, doctorLastName: string, doctorSpecialization: string, visitTime: Date): {tomorrowMessage: RabbitMQNotifierMessage, twoHoursMessage: RabbitMQNotifierMessage} {
        const localeDateOptions = { hour: '2-digit', minute: '2-digit', hour12: false } as const;
        const tomorrowMessage = `Здравствуйте, ${userName}! Напоминаем что вы записаны к специалисту ${doctorFirstName?.charAt(0) ?? ''} ${doctorLastName} (${doctorSpecialization}) завтра в ${visitTime.toLocaleTimeString('en-US', localeDateOptions)}!`
        const twoHoursMessage = `Здравствуйте, ${userName}! Запись к специалисту ${doctorFirstName?.charAt(0) ?? ''} ${doctorLastName} (${doctorSpecialization}) через два часа!`

        return {
            tomorrowMessage: {message: tomorrowMessage, userPhone},
            twoHoursMessage: {message: twoHoursMessage, userPhone}
        }
    }

    public async scheduleMessage(userPhone: string, userName: string, doctorFirstName: string, doctorLastName: string, doctorSpecialization: string, visitTime: Date) {
        if (!this.rabbitMQConnection) {
            Logger.error('RabbitMQ connection not initialized');
            return;
        }

        const {tomorrowMessage, twoHoursMessage} = Notifier.getMessages(
            userPhone, userName, doctorFirstName, doctorLastName, doctorSpecialization, visitTime
        );
        const { channel } = this.rabbitMQConnection;

        const visitTimeStamp = visitTime.getTime()
        const oneDayBefore = new Date(visitTimeStamp - (24 * 60 * 60 * 1000));
        const twoHoursBefore = new Date(visitTimeStamp - (2 * 60 * 60 * 1000));

        const delayForOneDayBefore = oneDayBefore.getTime() - Date.now();
        const delayForTwoHoursBefore = twoHoursBefore.getTime() - Date.now();

        if (delayForOneDayBefore >= 0) {
            channel.publish(
                Notifier.NOTIFIER_EXCHANGE,
                Notifier.NOTIFIER_ROUTING_KEY,
                Buffer.from(JSON.stringify(tomorrowMessage)),
                { headers: { 'x-delay': delayForOneDayBefore }}
            );
        }
        if (delayForTwoHoursBefore >= 0) {
            channel.publish(
                Notifier.NOTIFIER_EXCHANGE,
                Notifier.NOTIFIER_ROUTING_KEY,
                Buffer.from(JSON.stringify(twoHoursMessage)),
                { headers: { 'x-delay': delayForTwoHoursBefore }}
            );
        }
        Logger.info("Messages sent to RabbitMQ for", userPhone);
    }
}

export const notifier = new Notifier()