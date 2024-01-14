const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const NSE50Data = require('./models/NSE50Data');
const cors = require('cors');
const moment = require('moment');

dotenv.config();

const app = express();
const port = 3002;
app.use(cors());
app.use(bodyParser.json());

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
};

mongoose.connect(process.env.MONGODB_URI, mongooseOptions);

const db = mongoose.connection;

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.once('open', async () => {
    console.log('Connected to MongoDB');
});

const format = 'DD-MMM-YYYY HH:mm:ss'; // Define the format variable

app.post('/analyzeData', async (req, res) => {
    try {
        const totalData = 30;
        const sliceData = totalData / 2;

        const { fromDateTime, toDateTime } = req.body;

        const fromDate = parseDateStringToDate(fromDateTime);
        const toDate = parseDateStringToDate(toDateTime);

        const halfTime = getHalfwayTime(fromDate, toDate);

        const lastRecords = await NSE50Data.find({
            timestamp: {
                $gte: halfTime,
                $lt: toDate,
            }
        }).sort({ _id: -1 }).lean();

        if (lastRecords.length == 0) {
            console.error('Error: No data found in lastRecords MongoDB.');
        }

        const previousRecords = await NSE50Data.find({
            timestamp: {
                $gte: fromDate,
                $lt: halfTime,
            }
        }).sort({ _id: -1 }).lean();

        if (previousRecords.length == 0) {
            console.error('Error: No data found in previousRecords MongoDB.');
        }

        const symbolsLastPricesLast = [];
        const symbolsLastPricesPrevious = [];

        for (const entry of lastRecords) {
            for (const stock of entry.data) {
                symbolsLastPricesLast.push({
                    symbol: stock.symbol,
                    lastPrice: stock.lastPrice,
                    timestamp: entry.timestamp,
                });
            }
        }

        for (const entry of previousRecords) {
            for (const stock of entry.data) {
                symbolsLastPricesPrevious.push({
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

        const symbolMinMaxPrevious = calculateMinMaxForSymbols(symbolsLastPricesPrevious);
        const symbolMinMaxLast = calculateMinMaxForSymbols(symbolsLastPricesLast);

        console.log('Max and Min Last Prices (Previous ):');
        Object.keys(symbolMinMaxPrevious).forEach((symbol) => {
            console.log(`Symbol: ${symbol}`);
            console.log(`Max Last Price: ${symbolMinMaxPrevious[symbol].max} (Timestamp: ${symbolMinMaxPrevious[symbol].maxTimestamp})`);
            console.log(`Min Last Price: ${symbolMinMaxPrevious[symbol].min} (Timestamp: ${symbolMinMaxPrevious[symbol].minTimestamp})`);
            console.log('---');
        });

        console.log('Max and Min Last Prices (Last ):');
        Object.keys(symbolMinMaxLast).forEach((symbol) => {
            console.log(`Symbol: ${symbol}`);
            console.log(`Max Last Price: ${symbolMinMaxLast[symbol].max} (Timestamp: ${symbolMinMaxLast[symbol].maxTimestamp})`);
            console.log(`Min Last Price: ${symbolMinMaxLast[symbol].min} (Timestamp: ${symbolMinMaxLast[symbol].minTimestamp})`);
            console.log('---');
        });

        const symbolsData = Object.keys(symbolMinMaxLast).map((symbol) => {
            return {
                symbol,
                maxLastPriceLast: {
                    value: symbolMinMaxLast[symbol].max,
                    timestamp: symbolMinMaxLast[symbol].maxTimestamp,
                },
                minLastPriceLast: {
                    value: symbolMinMaxLast[symbol].min,
                    timestamp: symbolMinMaxLast[symbol].minTimestamp,
                },
                maxLastPricePrevious: {
                    value: symbolMinMaxPrevious[symbol].max,
                    timestamp: symbolMinMaxPrevious[symbol].maxTimestamp,
                },
                minLastPricePrevious: {
                    value: symbolMinMaxPrevious[symbol].min,
                    timestamp: symbolMinMaxPrevious[symbol].minTimestamp,
                },
            };
        });

        const fromDateTimes = moment(fromDate, format);
        const toDateTimes = moment(toDate, format);
        const halfTimes = moment(halfTime, format);

        const symbolsForBuyingStock = symbolsData
            .filter((symbolData) => symbolData.minLastPriceLast.value > symbolData.minLastPricePrevious.value && symbolData.maxLastPriceLast.value < symbolData.maxLastPricePrevious.value)
            .map((symbolData) => {
                return {
                    symbol: symbolData.symbol,
                    maxLastPriceLast: symbolData.maxLastPriceLast,
                    maxLastPricePrevious: symbolData.maxLastPricePrevious,
                    lastFromTime: halfTimes.format(format),
                    lastToTime: toDateTimes.format(format),
                    minLastPriceLast: symbolData.minLastPriceLast,
                    minLastPricePrevious: symbolData.minLastPricePrevious,
                    PreviousFromTime: fromDateTimes.format(format),
                    PreviousToTime: halfTimes.format(format),
                };
            });

        res.json({ symbolsForBuyingStock, symbolsData,  lastRecordsSize: lastRecords.length, previousRecordsSize: previousRecords.length });
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
});

app.listen(port, () => {
    console.log(`Data analysis server is running at http://localhost:${port}`);
});

function parseDateStringToDate(dateString) {
    const originalDate = moment(dateString, 'YYYY-MM-DD HH:mm');
    const formattedDateString = originalDate.format(format);
    console.log(formattedDateString);
    return formattedDateString;
}

function getHalfwayTime(fromDateTime, toDateTime) {
    const fromDate = moment(fromDateTime, format);
    const toDate = moment(toDateTime, format);
    const halfwayDate = moment(fromDate).add(toDate.diff(fromDate) / 2);
    const result = halfwayDate.format(format);
    return result;
}
