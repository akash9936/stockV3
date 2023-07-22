const axios = require('axios');

const apiUrl = 'https://api.example.com/mini-gpt-4';
const apiKey = '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';

const requestData = {
  prompt: 'Hello, MiniGPT-4!',
};

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${apiKey}`,
};

axios.post(apiUrl, requestData, { headers })
  .then(response => {
    const { message, data } = response.data;
    console.log('Response:', message);
    console.log('Data:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
