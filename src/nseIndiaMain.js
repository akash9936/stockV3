// nseIndia.js
const express = require('express');
const cors = require('cors');
const fetchData = require('./getNSEIndiaData');
const fetchDataTest = require('./TestData/TestData');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const NSE50DataV2 = require('./models/NSE50DataV2');
const { Mapper } = require('./Utills/Mappper');
const { TeleGramBot } = require('./TeleGramBot')
const { evaluateRules } = require('./ProcessRules')
const { insertSampleData } = require('./Utills/InsertRules');
const { isInTradingHours } = require('./Utills/checkMarketOpen')
const { createAlertMessages } = require('./Utills/CreateAlertMessage')


const app = express();
dotenv.config();
const fetchDataCronTime = 60000;
const port = 6000;
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    bufferTimeoutMS: 500000
};

// Use async/await to ensure the connection is established
function startServer() {
    (async () => {
        try {
            const mongoUri = process.env.MONGODB_URI;
            if (!mongoUri) {
                throw new Error('MONGO_URI is not defined in .env file');
            }
            await mongoose.connect(mongoUri, mongooseOptions); console.log('Connected to MongoDB');
            console.log('NseIndiaMain Started');
            // Set up the interval after the connection is established
            setInterval(async () => {
                try {

                    let marketOpen = isInTradingHours();
                    if (!marketOpen) {
                        console.log(`Market is not open`);
                        return;
                    }
                    const data = await fetchData();
                    //  const data = await fetchDataTest();
                    // await insertSampleData();
                    //   console.log(`Data: ${JSON.stringify(data)}`);
                    if (data) {

                       let simplifiedData = Mapper.dataMapper(data);

                       let evaluateRuless=await evaluateRules(simplifiedData);
                       const trueData = evaluateRuless.filter(data => data.evaluateResult);
                    //    console.log('trueData into MongoDB.', trueData);

                    let alertMessages = await createAlertMessages(trueData);
                    // console.log('alertMessages into MongoDB.',alertMessages);


                       await TeleGramBot(alertMessages);
                        // await NSE50DataV2.collection.insertOne(simplifiedData);
                        console.log('inserted into MongoDB.');
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


module.exports = { startServer };