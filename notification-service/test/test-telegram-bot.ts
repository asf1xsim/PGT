// notification-service/test/test-telegram-bot.ts
import 'reflect-metadata';
import dotenv from 'dotenv';
import {ObjectId} from 'mongodb';
import mongo from "../src/database/mongo";
import {notificationService} from "../src/services/notification.service";

dotenv.config({path: '.env'});

async function testTelegramBot() {
    try {
        console.log('🚀 Starting Telegram bot test...\n');

        await mongo.connect();
        console.log('✅ Connected to MongoDB');

        const testUserId = new ObjectId();
        console.log(`\n📝 Created test userId: ${testUserId}`);

        const yourChatId = '1194335038';

        console.log(`\n🔗 Linking userId with Telegram chatId: ${yourChatId}`);
        await notificationService.linkTelegramUser(
            testUserId.toString(),
            yourChatId
        );
        console.log('✅ User successfully linked with Telegram');

        console.log('\n📨 Sending test notification...');

        const notification = await notificationService.sendNotification({
            userId: testUserId.toString(),
            type: 'match_request',
            title: '🎮 New game request!',
            message: 'Player "ProGamer99" wants to play CS:GO with you. Ready to join?'
        });

        console.log('✅ Notification sent!');
        console.log(`   Notification ID: ${notification._id}`);

        console.log('\n📨 Sending additional notifications...');

        await notificationService.sendNotification({
            userId: testUserId.toString(),
            type: 'match_accepted',
            title: '✅ Request accepted!',
            message: 'Player "CasualGamer" accepted your Valorant game request'
        });

        await notificationService.sendNotification({
            userId: testUserId.toString(),
            type: 'new_message',
            title: '💬 New message',
            message: 'You have a new chat message: "Hey! When do we start?"'
        });

        console.log('✅ All notifications sent!');

        console.log('\n📋 Getting saved notifications from database...');
        const notifications = await notificationService.getNotifications(
            testUserId.toString(),
            10
        );

        console.log(`✅ Found ${notifications.length} notifications:`);
        notifications.forEach((notif, index) => {
            console.log(`   ${index + 1}. [${notif.type}] ${notif.title}`);
        });

        console.log('\n📤 Testing direct Telegram message sending...');
        await notificationService.sendTelegramMessage(
            yourChatId,
            '<b>🧪 Test message</b>\n\nThis message was sent directly via Telegram API.\n\n✨ If you see this message, your bot is working correctly!'
        );
        console.log('✅ Direct message sent!');

        console.log('\n🎉 Test completed successfully!');
        console.log('\n📱 Check your Telegram - you should receive 4 notifications');

    } catch (error) {
        console.error('\n❌ Error during test:', error);
        throw error;
    } finally {
        await mongo.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
}

testTelegramBot()
    .then(() => {
        console.log('\n✅ Script executed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Critical error:', error);
        process.exit(1);
    });