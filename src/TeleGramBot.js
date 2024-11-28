const axios = require('axios');
const { rules } = require('./Utills/Rules'); 
require('dotenv').config(); 

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
// console.log('token Data:', token);
// console.log(' chatId:', chatId);

const sendMessage = async (message) => {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    let messageContent=message;
    // console.log('Mapped Data:', messageContent);
    try {
        const response = await axios.post(url, {
            chat_id: chatId,
            text: messageContent,
            parse_mode: 'Markdown'
        });
    //    console.log('Message sent:', response.data);
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
};

const TeleGramBot = async (data) => {
    if (data && data.data && Array.isArray(data.data)) {
        // Initialize an array to store all messages
        let allMessages = [];

        // Iterate through each stock data
        data.data.forEach(stock => {
            // Call the rules function and get the messages for the current stock
            const messages = rules(stock);
            // console.log(`message is ${messages}`);
            
            // Append the messages to the allMessages array
            allMessages.push(messages);
        });

        // Combine all messages into a single string with two newlines between each message
        const combinedMessages = allMessages.join('\n\n');
        const chunks = splitMessage(combinedMessages);
        for (const chunk of chunks) {
            try {
                await sendMessage(chunk);
            } catch (error) {
                console.error('Error sending message:', error.response?.data || error.message);
            }
        }

        // Send the combined messages as one message
        
    } else {
        console.error('No data fetched or data is undefined');
    }
};

function splitMessage(message, maxLength = 4096) {
    const parts = [];
    while (message.length > 0) {
        parts.push(message.slice(0, maxLength));
        message = message.slice(maxLength);
    }
    return parts;
}



// const dynamicChat = async () =>{
//     let data = "Akash";
//     for (let value of data) {
//         console.log(value);
//         await sendMessage(value);  // Added await to ensure messages are sent sequentially
//     }
// };

module.exports = { TeleGramBot };