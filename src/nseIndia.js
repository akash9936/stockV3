// nseIndia.js
const express = require('express');
const cors = require('cors');
//const fetchData = require('./getNSEIndiaData');
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
        await mongoose.connect("mongodb+srv://akash9936:Tree9936@cluster0.f1wthph.mongodb.net/?retryWrites=true&w=majority", mongooseOptions);
        console.log('Connected to MongoDB');

        // Set up the interval after the connection is established
        setInterval(async () => {
            try {
                if (!isInTradingHours()) {
                    console.log("Market is not open")
                }
                else {
                    console.log("Trying to fetch data")
                    const data = await fetchData();
                 //   console.log("Data is fetched")
                    if (data) {
                        const simplifiedData = {
                            timestamp: data.timestamp,
                            data: data.data.map(stock => ({
                                symbol: stock.symbol,
                                lastPrice: stock.lastPrice
                            }))
                        };
                   //     console.log('Data before inserted into MongoDB.');
                        await NSE50Data.collection.insertOne(simplifiedData);
                    //    console.log('Data inserted into MongoDB.');
                    } else {
                        console.error('Error: Data is  not available.');
                    }
                }
            }
            catch (error) {
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

const isInTradingHours = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // Sunday is 0, Monday is 1, ..., Saturday is 6
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Check if it's a weekday (Monday to Friday) and within trading hours
    return dayOfWeek >= 1 && dayOfWeek <= 5 && hours >= 9 && hours < 15 && (hours !== 15 || minutes <= 35);
};

//get he user agent


//Below code call
// growwStock.js
const axios = require('axios');
const tough = require('tough-cookie');
const cookieJar = new tough.CookieJar();
let count = 1;
function fetchData() {
    return new Promise(async (resolve, reject) => {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050',
            headers: {
         //       'authority': 'www.nseindia.com',
          //      'accept': '*/*',
        //        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                'Cookie': cookieJar.getCookieStringSync('https://www.nseindia.com'),
            //     'dnt': '1',
            //      'referer': 'https://www.nseindia.com/market-data/live-equity-market',
            //     'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
            //     'sec-ch-ua-mobile': '?0',
            //     'sec-ch-ua-platform': '"macOS"',
            //     'sec-fetch-dest': 'empty',
            //     'sec-fetch-mode': 'cors',
            //   //  'sec-fetch-site': 'same-origin',
               'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
        
        }
           ,timeout: 30000,
        };
        try {
            await axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                    resolve(response.data);  // Resolve with the data
                    console.log("-----------------------------------------------------" + count);
                    count++;
                })
                .catch((error) => {
                    if (error.response && error.response.status !== 200) {
                        console.log(`[${new Date().toISOString()}] Received 401 Unauthorized error. Retrying after 1 second...`);
                        setTimeout(() => {
                            fetchData().then(resolve).catch(reject); // Retry after 1 second
                        }, 5000);
                    } else {
                        console.log(`[${new Date().toISOString()}] error accrued`);
                        reject(error);
                    }
                });
        }
        catch (ex) {
            console.log("Error occured while fetching data" + ex);

        }
    });

}

//module.exports = fetchData;
