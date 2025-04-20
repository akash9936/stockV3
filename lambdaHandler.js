const fetchData = require('./src/getNSEIndiaData');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const NSE50DataV2 = require('./src/models/NSE50DataV2');
const { Mapper } = require('./src/Utills/Mappper');
const { TeleGramBot } = require('./src/TeleGramBot');
const { evaluateRules } = require('./src/ProcessRules');
const { isInTradingHours } = require('./src/Utills/checkMarketOpen');
const { createAlertMessages } = require('./src/Utills/CreateAlertMessage');

dotenv.config();

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    bufferTimeoutMS: 500000
};

let isMongoConnected = false;

async function connectToMongo() {
    if (isMongoConnected) return;
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB');
}

exports.handler = async (event, context) => {
    try {
        await connectToMongo();

        const marketOpen = isInTradingHours();
        if (!marketOpen) {
            console.log('⏰ Market is not open.');
            return { message: 'Market is closed' };
        }

        const data = await fetchData();
        if (!data) {
            console.log('⚠️ No data fetched.');
            return { message: 'No data' };
        }

        const simplifiedData = Mapper.dataMapper(data);
        await NSE50DataV2.collection.insertOne(simplifiedData);

        const evaluateRuless = await evaluateRules(simplifiedData);
        const trueData = evaluateRuless.filter(d => d.evaluateResult);

        const alertMessages = await createAlertMessages(trueData);
        await TeleGramBot(alertMessages);

        console.log('✅ Data processed and alert sent.');
        return { message: 'Success' };
    } catch (error) {
        console.error('❌ Error in Lambda:', error.message);
        return { error: error.message };
    }
};
