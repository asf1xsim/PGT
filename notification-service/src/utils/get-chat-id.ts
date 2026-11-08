// notification-service/src/utils/get-chat-id.ts
import TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
    console.error('❌ TELEGRAM_BOT_TOKEN is not defined in .env');
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log('🤖 Bot is running. Send any message to get your chat ID...');

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from?.username || 'Unknown';
    const firstName = msg.from?.first_name || 'Unknown';

    console.log('\n' + '='.repeat(50));
    console.log('📩 New message received!');
    console.log('='.repeat(50));
    console.log(`👤 User: ${firstName} (@${username})`);
    console.log(`🆔 Chat ID: ${chatId}`);
    console.log(`💬 Message: ${msg.text}`);
    console.log('='.repeat(50) + '\n');

    bot.sendMessage(
        chatId,
        `✅ Your Chat ID is: ${chatId}\n\nAdd this to your .env file:\nTELEGRAM_CHAT_ID=${chatId}`
    );
});

bot.on('polling_error', (error) => {
    console.error('❌ Polling error:', error.message);
});