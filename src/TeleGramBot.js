const axios = require('axios');
const { rules } = require('./Utills/Rules'); 

// Replace with your bot token
const token = "6891633585:AAF4nt0aJpnDg7w_2fvQ3KYwxh_0o_YDD5M";
// Replace with your chat ID
const chatId = "@GoStockLive"; // Ensure this is correct
const sendMessage = async (message) => {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    let messageContent=message;
    console.log('Mapped Data:', messageContent);
    try {
        const response = await axios.post(url, {
            chat_id: chatId,
            text: messageContent,
            parse_mode: 'Markdown'
        });
      //  console.log('Message sent:', response.data);
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
};

const TeleGramBot = (data) => {
    if (data && data.data && Array.isArray(data.data)) {
        data.data.forEach(stock => {
            let messages = rules(stock); // Call the rules function with each stock data
            
            messages.forEach(message => {
                console.log('Message Content:', message); // Log message for debugging
                sendMessage(message); // Send each message
            });
        });
    } else {
        console.error('No data fetched or data is undefined');
    }
};

// const dynamicChat = async () =>{
//     let data = "Akash";
//     for (let value of data) {
//         console.log(value);
//         await sendMessage(value);  // Added await to ensure messages are sent sequentially
//     }
// };

module.exports = { TeleGramBot };