// nseIndia.js
const express = require('express');
const cors = require('cors');
const fetchData = require('./getNSEIndiaData');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const NSE50DataV2 = require('./models/NSE50DataV2');
const app = express();
dotenv.config();
const port = 4000;
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    bufferTimeoutMS: 500000
};

// Use async/await to ensure the connection is established
(async () => {
    try {
        await mongoose.connect("mongodb+srv://akash9936:Tree9936@cluster0.f1wthph.mongodb.net/?retryWrites=true&w=majority", mongooseOptions);
        console.log('Connected to MongoDB');
        console.log('NseIndiaV2 Started');
        // Set up the interval after the connection is established
        setInterval(async () => {
            try {
                const data = await fetchData();

                if (data) {
                    const simplifiedData = {
                        timestamp: data.timestamp,
                        data: data.data.map(stock => ({
                            priority: stock.priority,
                            symbol: stock.symbol,
                            identifier: stock.identifier,
                            open: stock.open,
                            dayHigh: stock.dayHigh,
                            dayLow: stock.dayLow,
                            lastPrice: stock.lastPrice,
                            previousClose: stock.previousClose,
                            change: stock.change,
                            pChange: stock.pChange,
                            ffmc: stock.ffmc,
                            yearHigh: stock.yearHigh,
                            yearLow: stock.yearLow,
                            totalTradedVolume: stock.totalTradedVolume,
                            totalTradedValue: stock.totalTradedValue,
                            lastUpdateTime: stock.lastUpdateTime,
                            nearWKH: stock.nearWKH,
                            nearWKL: stock.nearWKL,
                            perChange365d: stock.perChange365d,
                            date365dAgo: stock.date365dAgo,
                            chart365dPath: stock.chart365dPath,
                            date30dAgo: stock.date30dAgo,
                            perChange30d: stock.perChange30d,
                            chart30dPath: stock.chart30dPath,
                            chartTodayPath: stock.chartTodayPath
                        }))
                    };

                  await NSE50DataV2.collection.insertOne(simplifiedData);
                    console.log('Data inserted into MongoDB.');
                } else {
                    console.error('Error: Data is not available.');
                }
            } catch (error) {
                console.error('Error fetching or inserting data:', error.message);
            }
        }, 60000);

        // Set up the Express server
        app.use(cors());

        app.get('/getNseIndia', (req, res) => {
            res.json({ message: 'Fetching data from NSE India' });
        });

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
})();


const data={
    priority: { type: Number },
    symbol: { type: String },
    identifier: { type: String },
    open: { type: Number },
    dayHigh: { type: Number },
    dayLow: { type: Number },
    lastPrice: { type: Number },
    previousClose: { type: Number },
    change: { type: Number },
    pChange: { type: Number },
    ffmc: { type: Number },
    yearHigh: { type: Number },
    yearLow: { type: Number },
    totalTradedVolume: { type: Number },
    totalTradedValue: { type: Number },
    lastUpdateTime: { type: String },
    nearWKH: { type: Number },
    nearWKL: { type: Number },
    perChange365d: { type: Number },
    date365dAgo: { type: String },
    chart365dPath: { type: String },
    date30dAgo: { type: String },
    perChange30d: { type: Number },
    chart30dPath: { type: String },
    chartTodayPath: { type: String },
  };
  