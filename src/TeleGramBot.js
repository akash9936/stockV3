const axios = require('axios');
const { rules } = require('./Utills/Rules'); 
const {getMessageInParts} = require('./Utills/TeleGramMessageController')
require('dotenv').config(); 
const TELEGRAM_MESSAGE_LIMIT = 500;
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
console.log('token Data:', token);
console.log(' chatId:', chatId);

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
       console.log('Message sent:', response.data);
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
};

const TeleGramBot = (dataArray) => {
    // console.log('dataArray data:', dataArray);
    // if (dataArray && Array.isArray(dataArray)) {
        // Initialize an array to store all messages
        let allMessages = [];

        // Log the incoming data for debugging
        // console.log('Received data:', dataArray);
        //  console.log('dataArray Messages 1:', dataArray);

        // Iterate through each object in the data array
        // dataArray.forEach(data => {
        //     // Extract the alertMessage for the current object
        //     if (data.alertMessage) {
        //         allMessages.push(data.alertMessage);
        //     }
        // });

        // Combine all messages into a single string with two newlines between each message
        const combinedMessages = dataArray.join('\n\n');
        // Log the combined messages for debugging
        // console.log('Combined Messages:', combinedMessages);

        // Send the combined messages as one message
        // sendMessage(combinedMessages);

        //send message in parts
        // console.error('combinedMessages data fetched or data is',combinedMessages);

        const messageParts = getMessageInParts(combinedMessages);
        // console.error('messageParts data fetched or data is',messageParts);

        // Send each part individually
        messageParts.forEach(part => sendMessage(part));

    // } else {
    //     console.error('No data fetched or data is undefined');
    // }
};







// const dynamicChat = async () =>{
//     let data = "Akash";
//     for (let value of data) {
//         console.log(value);
//         await sendMessage(value);  // Added await to ensure messages are sent sequentially
//     }
// };

module.exports = { TeleGramBot };