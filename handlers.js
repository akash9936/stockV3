const fetchData = require('./src/getNSEIndiaData');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const NSE50DataV2 = require('./src/models/NSE50DataV2');
const { Mapper } = require('./src/Utills/Mappper');
const { isInTradingHours } = require('./src/Utills/checkMarketOpen');

dotenv.config();

// MongoDB connection
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false
};

// let cachedDb = null;

async function connectToDatabase() {
  // if (cachedDb && mongoose.connection.readyState === 1) {
  //   return cachedDb;
  // }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  cachedDb = await mongoose.connect(mongoUri, mongooseOptions);
  console.log('Connected to MongoDB');
  // return cachedDb;
}

// Handler for scheduled data fetching
module.exports.fetchDataHandler = async (event, context) => {
  // Make the function use callbackWaitsForEmptyEventLoop to reuse the connection
  context.callbackWaitsForEmptyEventLoop = false;
  console.log("Inside fetchDataHandler ")
  try {
    await connectToDatabase();
    
    // let marketOpen = isInTradingHours();
    // if (!marketOpen) {
    //   console.log(`Market is not open`);
    //   return { statusCode: 200, body: JSON.stringify({ message: 'Market is not open' }) };
    // }
    console.log('before fetching data');
    const data = await fetchData();
    console.log('Got the data from fetch data');
    if (data) {
      let simplifiedData = Mapper.dataMapper(data);
      await NSE50DataV2.collection.insertOne(simplifiedData);
      
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

