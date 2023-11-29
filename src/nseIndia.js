// nseIndia.js
const express = require('express');
const cors = require('cors');
const fetchData = require('./getNSEIndiaData');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const NSE50Data = require('./models/NSE50Data');
const app = express();
dotenv.config();
const port = 4000;
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    bufferTimeoutMS: 5000
};

// Use async/await to ensure the connection is established
(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
        console.log('Connected to MongoDB');

        // Set up the interval after the connection is established
        setInterval(async () => {
            try {
                const data = await fetchData();

                if (data) {
                    const simplifiedData = {
                        timestamp: data.timestamp,
                        data: data.data.map(stock => ({
                            symbol: stock.symbol,
                            lastPrice: stock.lastPrice
                        }))
                    };

                  await NSE50Data.collection.insertOne(simplifiedData);
                    console.log('Data inserted into MongoDB.');
                } else {
                    console.error('Error: Data is not available.');
                }
            } catch (error) {
                console.error('Error fetching or inserting data:', error.message);
            }
        }, 10000);

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
