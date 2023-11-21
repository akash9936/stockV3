const express = require('express');
const axios = require('axios');
const finnhub = require('finnhub');

const app = express();
const port = 3000;

app.get('/getStockData', async (req, res) => {
    try {
        // // Replace 'demo' with your own API key
        // const apiKey = 'ZBZ4AL6P11TAAN4K';
        // const symbol = 'IBM';
        // const interval = '5min';

        // const apiUrl = `https://www.alphavantage.com/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${apiKey}`;

        // const response = await axios.get(apiUrl, { headers: { 'User-Agent': 'axios' } });
        // const data = response.data;

        // res.json(data);

        

const api_key = finnhub.ApiClient.instance.authentications['cl8t6rpr01qsl3vi437gcl8t6rpr01qsl3vi4380'];
api_key.apiKey = "cl8t6rpr01qsl3vi437gcl8t6rpr01qsl3vi4380"
const finnhubClient = new finnhub.DefaultApi()

finnhubClient.stockCandles("AAPL", "D", 1590988249, 1591852249, (error, data, response) => {
  console.log(data)
});
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
