const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const NSE50Data = require('./models/NSE50Data');
const cors = require('cors');
dotenv.config();

const app = express();
const port = 3002; // Choose a port for the data analysis server
app.use(cors()); 
app.use(bodyParser.json());

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, // Add this line to suppress another deprecation warning
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
        const totalData = 30;
        const sliceData = totalData / 2;
        // Retrieve the data from MongoDB
        const currentDate = new Date(); // Get the current date and time
        const currentHours = currentDate.getHours();
        const currentMinutes = currentDate.getMinutes();
        
        // Calculate the start and end times for the 15-minute window
        const endMinutes = currentMinutes - (currentMinutes % 15); // Round down to the nearest multiple of 15
        let startMinutes = endMinutes - 15;
        if (startMinutes < 0) {
            // If startMinutes is negative, adjust it to the previous hour
            startMinutes += 60;
        }
        // Format the start and end times as strings
        const startTime = `${String(currentHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')} PM`;
        const endTime = `${String(currentHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')} PM`;
        
        console.log(`Start Time: ${startTime}`);
        console.log(`End Time: ${endTime}`);

        
        

        const dataFromMongo = await NSE50Data.find().sort({ _id: -1 }).limit(totalData).lean();

        if (dataFromMongo.length > 0) {
            // Extract the last 5 and previous 5 records
            const last5Records = dataFromMongo.slice(0, sliceData);
            const previous5Records = dataFromMongo.slice(sliceData, sliceData * 2);

            // Extract symbols and last prices
            const symbolsLastPricesLast5 = [];
            const symbolsLastPricesPrevious5 = [];

            for (const entry of last5Records) {
                for (const stock of entry.data) {
                    symbolsLastPricesLast5.push({
                        symbol: stock.symbol,
                        lastPrice: stock.lastPrice,
                        timestamp: entry.timestamp,
                    });
                }
            }

            for (const entry of previous5Records) {
                for (const stock of entry.data) {
                    symbolsLastPricesPrevious5.push({
                        symbol: stock.symbol,
                        lastPrice: stock.lastPrice,
                        timestamp: entry.timestamp,
                    });
                }
            }

            const calculateMinMaxForSymbols = (symbolLastPrices) => {
                const symbolMinMaxMap = {};

                symbolLastPrices.forEach((entry) => {
                    const { symbol, lastPrice, timestamp } = entry;

                    if (!symbolMinMaxMap[symbol]) {
                        symbolMinMaxMap[symbol] = { max: -Infinity, min: Infinity, maxTimestamp: '', minTimestamp: '' };
                    }

                    if (lastPrice > symbolMinMaxMap[symbol].max) {
                        symbolMinMaxMap[symbol].max = lastPrice;
                        symbolMinMaxMap[symbol].maxTimestamp = timestamp;
                    }

                    if (lastPrice < symbolMinMaxMap[symbol].min) {
                        symbolMinMaxMap[symbol].min = lastPrice;
                        symbolMinMaxMap[symbol].minTimestamp = timestamp;
                    }
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
                console.log(`Max Last Price: ${symbolMinMaxPrevious5[symbol].max} (Timestamp: ${symbolMinMaxPrevious5[symbol].maxTimestamp})`);
                console.log(`Min Last Price: ${symbolMinMaxPrevious5[symbol].min} (Timestamp: ${symbolMinMaxPrevious5[symbol].minTimestamp})`);
                console.log('---');
            });

            console.log('Max and Min Last Prices (Last 5):');
            Object.keys(symbolMinMaxLast5).forEach((symbol) => {
                console.log(`Symbol: ${symbol}`);
                console.log(`Max Last Price: ${symbolMinMaxLast5[symbol].max} (Timestamp: ${symbolMinMaxLast5[symbol].maxTimestamp})`);
                console.log(`Min Last Price: ${symbolMinMaxLast5[symbol].min} (Timestamp: ${symbolMinMaxLast5[symbol].minTimestamp})`);
                console.log('---');
            });

            const symbolsData = Object.keys(symbolMinMaxLast5).map((symbol) => {
                return {
                    symbol,
                    maxLastPriceLast5: {
                        value: symbolMinMaxLast5[symbol].max,
                        timestamp: symbolMinMaxLast5[symbol].maxTimestamp,
                    },
                    minLastPriceLast5: {
                        value: symbolMinMaxLast5[symbol].min,
                        timestamp: symbolMinMaxLast5[symbol].minTimestamp,
                    },
                    maxLastPricePrevious5: {
                        value: symbolMinMaxPrevious5[symbol].max,
                        timestamp: symbolMinMaxPrevious5[symbol].maxTimestamp,
                    },
                    minLastPricePrevious5: {
                        value: symbolMinMaxPrevious5[symbol].min,
                        timestamp: symbolMinMaxPrevious5[symbol].minTimestamp,
                    },
                };
            });

            const symbolsForBuyingStock = symbolsData
                .filter((symbolData) => symbolData.minLastPriceLast5.value < symbolData.minLastPricePrevious5.value && symbolData.maxLastPriceLast5.value < symbolData.maxLastPricePrevious5.value)
                .map((symbolData) => {
                    return {
                        symbol: symbolData.symbol,
                        maxLastPriceLast5: symbolData.maxLastPriceLast5,
                        maxLastPricePrevious5: symbolData.maxLastPricePrevious5,
                        minLastPriceLast5: symbolData.minLastPriceLast5,
                        minLastPricePrevious5: symbolData.minLastPricePrevious5,
                    };
                });

            res.json({ symbolsForBuyingStock, symbolsData });
        } else {
            console.error('Error: No data found in MongoDB.');
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
});


app.listen(port, () => {
    console.log(`Data analysis server is running at http://localhost:${port}`);
});