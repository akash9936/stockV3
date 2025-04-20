const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const fetchData = require('./src/getNSEIndiaData');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const NSE50DataV2 = require('./src/models/NSE50DataV2');
const { Mapper } = require('./src/Utills/Mappper');
const { TeleGramBot } = require('./src/TeleGramBot');
const { evaluateRules } = require('./src/ProcessRules');
const { isInTradingHours } = require('./src/Utills/checkMarketOpen');
const { createAlertMessages } = require('./src//Utills/CreateAlertMessage');

dotenv.config();

// MongoDB connection
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false,
  bufferTimeoutMS: 500000
};

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  cachedDb = await mongoose.connect(mongoUri, mongooseOptions);
  console.log('Connected to MongoDB');
  return cachedDb;
}

// Handler for scheduled data fetching
exports.fetchDataHandler = async (event, context) => {
  // Make the function use callbackWaitsForEmptyEventLoop to reuse the connection
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    await connectToDatabase();
    
    // let marketOpen = isInTradingHours();
    // if (!marketOpen) {
    //   console.log(`Market is not open`);
    //   return { statusCode: 200, body: JSON.stringify({ message: 'Market is not open' }) };
    // }
    
    const data = await fetchData();
    
    if (data) {
      let simplifiedData = Mapper.dataMapper(data);
      await NSE50DataV2.collection.insertOne(simplifiedData);
    //   let evaluateRuless = await evaluateRules(simplifiedData);
    //   const trueData = evaluateRuless.filter(data => data.evaluateResult);
      
    //   let alertMessages = await createAlertMessages(trueData);
    //   await TeleGramBot(alertMessages);
      
      console.log('Data inserted into MongoDB');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Data successfully fetched and processed' })
      };
    } else {
      console.error('Error: Data is not available');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Data is not available' })
      };
    }
  } catch (error) {
    console.error('Error fetching or inserting data:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

// API Handler using Express
const app = express();
app.use(cors());

app.get('/getNseIndia', (req, res) => {
  res.json({ message: 'Fetching data from NSE India Nifty 50' });
});

// Convert Express app to Lambda compatible handler
exports.apiHandler = serverless(app);