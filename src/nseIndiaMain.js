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
const fetchDataCronTime = 30000;
const port = 6002;
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
                throw new Error('MONGODB_URI is not defined in .env file');
            }
            
            console.log('Connecting to MongoDB...');
            await mongoose.connect(mongoUri, mongooseOptions);
            console.log('Connected to MongoDB');
            console.log('NseIndiaMain Started');
            
            // Set up the interval after the connection is established
            const intervalId = setInterval(async () => {
                try {
                    // Uncomment to check if market is open
                    // let marketOpen = isInTradingHours();
                    // if (!marketOpen) {
                    //     console.log(`Market is not open`);
                    //     return;
                    // }
                    
                    console.log(`[${new Date().toISOString()}] Fetching data from NSE...`);
                    const data = await fetchData();
                    // const data = await fetchDataTest();
                    // await insertSampleData(); //For Rules
                    
                    if (data) {
                        console.log(`[${new Date().toISOString()}] Data received successfully`);
                        let simplifiedData = Mapper.dataMapper(data);

                        // Uncomment to evaluate rules
                        // let evaluateRuless = await evaluateRules(simplifiedData);
                        // const trueData = evaluateRuless.filter(data => data.evaluateResult);
                        // console.log('trueData into MongoDB.', trueData);

                        // Uncomment to create and send alerts
                        // let alertMessages = await createAlertMessages(trueData);
                        // console.log('simplifiedData into v.',simplifiedData);
                        // await TeleGramBot(alertMessages);
                        
                        try {
                            const insertResult = await NSE50DataV2.collection.insertOne(simplifiedData);
                            if (insertResult.acknowledged && insertResult.insertedId) {
                                console.log(`[${new Date().toISOString()}] ✅ MongoDB insert successful. Inserted ID: ${insertResult.insertedId}`);
                            } else {
                                console.error(`[${new Date().toISOString()}] ❌ MongoDB insert failed: No acknowledgment from server`);
                            }
                        } catch (insertError) {
                            console.error(`[${new Date().toISOString()}] ❌ Error during MongoDB insert:`, insertError.message);
                        }
                    } else {
                        console.error(`[${new Date().toISOString()}] Error: Data is not available.`);
                    }
                } catch (error) {
                    console.error(`[${new Date().toISOString()}] Error fetching or inserting data:`, error.message);
                }
            }, fetchDataCronTime);

            // Handle process termination to properly close connections
            process.on('SIGINT', async () => {
                clearInterval(intervalId);
                await mongoose.connection.close();
                console.log('MongoDB connection closed through app termination');
                process.exit(0);
            });

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
            process.exit(1);
        }
    })();
}

module.exports = { startServer };