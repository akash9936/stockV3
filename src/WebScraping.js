// index.js
const axios = require('axios');
const cheerio = require('cheerio');

// Function to scrape stock data from NSE website
async function scrapeStockData(stockSymbol) {
  try {
    // Fetch the webpage for the stock from NSE
    const url = `https://www.nseindia.com/get-quotes/equity?symbol=NESTLEIND`;
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    console.log(`data for ${data}: ${url}`);

    // Load the HTML using Cheerio
    const $ = cheerio.load(data);

    // Extract earnings and dividend data (these are hypothetical selectors)
    const earnings = $('.earnings-section').text().trim();
    const dividends = $('.dividend-rate').text().trim();

    console.log(`Earnings for ${stockSymbol}: ${earnings}`);
    console.log(`Dividends for ${stockSymbol}: ${dividends}`);
  } catch (error) {
    console.error(`Error scraping data for ${stockSymbol}:`, error);
  }
}

// Example: Scrape data for Reliance
scrapeStockData('NESTLEIND');
