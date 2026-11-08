// notification-service/src/services/notification.service.ts
import { ObjectId } from 'mongodb';
import mongo from '../database/mongo';
import TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = TELEGRAM_BOT_TOKEN ? new TelegramBot(TELEGRAM_BOT_TOKEN) : null;

interface NotificationData {
    userId: string;
    type: 'match_request' | 'match_accepted' | 'match_declined' | 'new_message';
    title: string;
    message: string;
}

export const notificationService = {
    get notifications_collection() {
        if (!mongo.db) {
            throw new Error('Database not initialized');
        }
        return mongo.db.collection('notifications');
    },

    get telegram_users_collection() {
        if (!mongo.db) {
            throw new Error('Database not initialized');
        }
        return mongo.db.collection('telegram_users');
    },

    async linkTelegramUser(userId: string, chatId: string) {
        await this.telegram_users_collection.updateOne(
            { userId },
            { $set: { chatId, linkedAt: new Date() } },
            { upsert: true }
        );

        return {
            success: true,
            message: 'Telegram account linked successfully',
            userId,
            chatId
        };
    },

    async getTelegramChatId(userId: string): Promise<string | null> {
        const user = await this.telegram_users_collection.findOne({ userId });
        return user?.chatId || null;
    },

    async sendNotification(data: NotificationData) {
        const notification = {
            ...data,
            read: false,
            createdAt: new Date()
        };

        const result = await this.notifications_collection.insertOne(notification);

        const savedNotification = {
            _id: result.insertedId,
            ...notification
        };
        if (bot) {
            const chatId = await this.getTelegramChatId(data.userId);
            if (chatId) {
                try {
                    await bot.sendMessage(
                        chatId,
                        `📢 *${data.title}*\n\n${data.message}`,
                        { parse_mode: 'Markdown' }
                    );
                } catch (error) {
                    console.error('Failed to send Telegram notification:', error);
                }
            }
        }

        return savedNotification;
    },

    async getNotifications(userId: string, limit: number = 20) {
        return this.notifications_collection
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .toArray();
    },

    async markAsRead(notificationId: string) {
        return this.notifications_collection.updateOne(
            { _id: new ObjectId(notificationId) },
            { $set: { read: true, readAt: new Date() } }
        );
    },

    async deleteNotification(notificationId: string) {
        return this.notifications_collection.deleteOne({
            _id: new ObjectId(notificationId)
        });
    },
    async sendTelegramMessage(chatId: string, text: string) {
        if (!bot) {
            console.warn('Telegram bot token not configured');
            return;
        }

        try {
            const url = `https://api.telegram.org/bot${!bot}/sendMessage`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: 'HTML'
                })
            });

            if (!response.ok) {
                console.error('Failed to send Telegram message:', await response.text());
            }
        } catch (error) {
            console.error('Error sending Telegram message:', error);
        }
    }
};