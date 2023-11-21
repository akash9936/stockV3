const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const NSE50Data = require('./models/NSE50Data');
const cors = require('cors');
dotenv.config();

const app = express();
const port = 3001; // Choose a port for the data analysis server
app.use(cors()); 
app.use(bodyParser.json());

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    bufferTimeoutMS: 50000
};

mongoose.connect(process.env.MONGODB_URI, mongooseOptions);

const db = mongoose.connection;

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.once('open', async () => {
    console.log('Connected to MongoDB');
});

app.post('/analyzeData', async (req, res) => {
    try {
        const totalData=30;
        const sliceData=totalData/2;
        // Retrieve the data from MongoDB
        const dataFromMongo = await NSE50Data.find().sort({ timestamp: -1 }).limit(totalData).lean();

        if (dataFromMongo.length > 0) {
            // Extract the last 5 and previous 5 records
            const last5Records = dataFromMongo.slice(0, sliceData);
            const previous5Records = dataFromMongo.slice(sliceData, sliceData*2);

            // Extract symbols and last prices
            const symbolsLastPricesLast5 = [];

            for (const entry of last5Records) {
                // Assuming data is an array of stock data in each entry
                for (const stock of entry.data) {
                    symbolsLastPricesLast5.push({
                        symbol: stock.symbol,
                        lastPrice: stock.lastPrice,
                    });
                }
            }
            const symbolsLastPricesPrevious5 = [];
            for (const entry of previous5Records) {
                // Assuming data is an array of stock data in each entry
                for (const stock of entry.data) {
                    symbolsLastPricesPrevious5.push({
                        symbol: stock.symbol,
                        lastPrice: stock.lastPrice,
                    });
                }
            }

            const calculateMinMaxForSymbols = (symbolLastPrices) => {
                const symbolMinMaxMap = {};

                symbolLastPrices.forEach((entry) => {
                    const { symbol, lastPrice } = entry;

                    if (!symbolMinMaxMap[symbol]) {
                        symbolMinMaxMap[symbol] = { max: -Infinity, min: Infinity };
                    }

                    symbolMinMaxMap[symbol].max = Math.max(symbolMinMaxMap[symbol].max, lastPrice);
                    symbolMinMaxMap[symbol].min = Math.min(symbolMinMaxMap[symbol].min, lastPrice);
                });

                return symbolMinMaxMap;
            };

            // Calculate min and max for symbols in the previous 5 records
            const symbolMinMaxPrevious5 = calculateMinMaxForSymbols(symbolsLastPricesPrevious5);

            // Calculate min and max for symbols in the last 5 records
            const symbolMinMaxLast5 = calculateMinMaxForSymbols(symbolsLastPricesLast5);

            // Log the results
            console.log('Max and Min Last Prices (Previous 5):');
            Object.keys(symbolMinMaxPrevious5).forEach((symbol) => {
                console.log(`Symbol: ${symbol}`);
                console.log(`Max Last Price: ${symbolMinMaxPrevious5[symbol].max}`);
                console.log(`Min Last Price: ${symbolMinMaxPrevious5[symbol].min}`);
                console.log('---');
            });

            console.log('Max and Min Last Prices (Last 5):');
            Object.keys(symbolMinMaxLast5).forEach((symbol) => {
                console.log(`Symbol: ${symbol}`);
                console.log(`Max Last Price: ${symbolMinMaxLast5[symbol].max}`);
                console.log(`Min Last Price: ${symbolMinMaxLast5[symbol].min}`);
                console.log('---');
            });
            const symbolsForBuyingStock = [];
            Object.keys(symbolMinMaxLast5).forEach((symbol) => {
                if (symbolMinMaxLast5[symbol].min < symbolMinMaxPrevious5[symbol].min && symbolMinMaxLast5[symbol].max < symbolMinMaxPrevious5[symbol].max) {
                    console.log(`Symbol for buying Stock is: ${symbol}`);
                    symbolsForBuyingStock.push(symbol);
                }
            });
            res.json({ symbolsForBuyingStock });
        } else {
            console.error('Error: No data found in MongoDB.');
        }

        // Close the MongoDB connection
    //    mongoose.connection.close();
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
});
app.listen(port, () => {
    console.log(`Data analysis server is running at http://localhost:${port}`);
});