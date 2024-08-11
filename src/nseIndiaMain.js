// nseIndia.js
const express = require('express');
const cors = require('cors');
const fetchData = require('./getNSEIndiaData');
const fetchDataTest = require('./TestData/TestData');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const NSE50DataV2 = require('./models/NSE50DataV2');
const { Mapper } = require('./Utills/Mappper');
const {TeleGramBot} =require('./TeleGramBot')
const app = express();
dotenv.config();
const fetchDataCronTime=60000;
const port = 6000;
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    bufferTimeoutMS: 500000
};

// Use async/await to ensure the connection is established
function startServer(){
(async () => {
    try {
        await mongoose.connect("mongodb+srv://akash9936:Tree9936@cluster0.f1wthph.mongodb.net/?retryWrites=true&w=majority", mongooseOptions);
        console.log('Connected to MongoDB');
        console.log('NseIndiaV2 Started');
        // Set up the interval after the connection is established
        setInterval(async () => {
            try 
            {
               // const data = await fetchData();
                const data = await fetchDataTest();
             //   console.log(`Data: ${JSON.stringify(data)}`);
                if (data) {

                    const simplifiedData=Mapper.dataMapper(data);
                   
                    TeleGramBot(simplifiedData);
                //  await NSE50DataV2.collection.insertOne(simplifiedData);
                //    console.log('After inserted into MongoDB.'+simplifiedData);
                } else {
                    console.error('Error: Data is not available.');
                }
            } catch (error) {
                console.error('Error fetching or inserting data:', error.message);
            }
        }, fetchDataCronTime);

        // Set up the Express server
        app.use(cors());

        app.get('/getNseIndia', (req, res) => {
            res.json({ message: 'Fetching data from NSE India Nifty 50' });
        });

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
})();
}

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
  

  module.exports = { startServer };