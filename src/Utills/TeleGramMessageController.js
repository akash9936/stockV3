const axios = require('axios');
require('dotenv').config();

const TELEGRAM_MESSAGE_LIMIT = 4096; // Telegram's character limit for a single message
const MAX_ALLOWED_PARTS = 10; // Maximum allowed message parts
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

// Escape special Markdown characters
const escapeMarkdown = (text) => {
    return text
        .replace(/_/g, '\\_')
        .replace(/\*/g, '\\*')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/~/g, '\\~')
        .replace(/`/g, '\\`')
        .replace(/>/g, '\\>')
        .replace(/#/g, '\\#')
        .replace(/\+/g, '\\+')
        .replace(/-/g, '\\-')
        .replace(/=/g, '\\=')
        .replace(/\|/g, '\\|')
        .replace(/{/g, '\\{')
        .replace(/}/g, '\\}')
        .replace(/\./g, '\\.')
        .replace(/!/g, '\\!');
};

// Split the message into parts
const getMessageInParts = (message, limit = TELEGRAM_MESSAGE_LIMIT) => {
    const parts = [];
    let currentPart = '';

    const addCurrentPart = () => {
        if (currentPart.trim().length > 0) {
            parts.push(currentPart.trim());
        }
        currentPart = '';
    };

    const lines = message.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if ((currentPart + line + '\n').length > limit) {
            if (parts.length < MAX_ALLOWED_PARTS) {
                addCurrentPart();
                currentPart = line + '\n';
            } else {
                console.warn('Message exceeds the limit. Discarding excess content.');
                break;
            }
        } else {
            currentPart += line + '\n';
        }
    }

    if (parts.length < MAX_ALLOWED_PARTS && currentPart.trim().length > 0) {
        addCurrentPart();
    }

    return parts;
};

module.exports = { getMessageInParts };
