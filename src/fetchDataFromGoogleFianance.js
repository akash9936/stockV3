const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');

dotenv.config();

const GoogleFinance = require('./models/GoogleFiance');
const stockname = require('./models/stockname');

const app = express();
const port = 4000;

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false
};

async function fetchStockData(stock, market) {
    const url = `https://www.google.com/finance/quote/${stock}:${market}`;

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const class1 = 'YMlKec.fxKbKc';
        const price = $(`.${class1}`).text().trim().slice(1).replace(",", "");

        return {
            stock,
            market,
            price: parseFloat(price),
            timestamp: moment().format('DD-MMM-YYYY HH:mm:ss'),
        };
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error;
    }
}

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
        console.log('Connected to MongoDB');
        const db = await mongoose.connection;
        console.log('Connected to MongoDB, Database:', mongoose.connection.db.databaseName);

        db.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        
        db.once('open', async () => {
            console.log('Connected to MongoDB finally');
        });
        
    
     // ...

setInterval(async () => {
    try {

//const resultdata=await stockname.insertMany(jsonData);
//console.log("Number of stockEntries:1 " + resultdata.length);


        const stockEntries = await stockname.find({}).sort({ _id: -1 }).lean();
        console.log("Number of stockEntries: " + stockEntries.length);
        console.log("Latest stockEntries: ", stockEntries);

        const data = [];

        if (stockEntries.length === 0) {
            console.error('Error: No data found in stockname collection.');
        }

        for (const entry of stockEntries) {
           // console.log(`Processing entry: ${JSON.stringify(entry)}`);
            
            const stockData = await fetchStockData(entry.Symbol, entry.Market);

            if (stockData) {
                data.push({
                    symbol: stockData.stock,
                    lastPrice: stockData.price
                });
            } else {
                console.error(`Error: Data for ${entry.Symbol}:${entry.Market} is not available.`);
            }
        }

        if (data.length > 0) {
            const timestamp = moment().format('DD-MMM-YYYY HH:mm:ss');
            const combinedData = {
                timestamp,
                data: [...data]
            };

            await GoogleFinance.collection.insertOne(combinedData);
            console.log('Data inserted into GoogleFinance collection.');
        } else {
            console.error('Error: No data available.');
        }
    } catch (error) {
        console.error('Error fetching or inserting data:', error.message);
    }
}, 6000);

// ...


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




const jsonData = [
    {
      "Id": 1,
      "Company_Name": "Adani Enterprises Ltd.",
      "Industry": "Metals & Mining",
      "Symbol": "ADANIENT",
      "Market": "NSE"
    },
    {
      "Id": 2,
      "Company_Name": "Adani Ports and Special Economic Zone Ltd.",
      "Industry": "Services",
      "Symbol": "ADANIPORTS",
      "Market": "NSE"
    },
    {
      "Id": 3,
      "Company_Name": "Apollo Hospitals Enterprise Ltd.",
      "Industry": "Healthcare",
      "Symbol": "APOLLOHOSP",
      "Market": "NSE"
    },
    {
      "Id": 4,
      "Company_Name": "Asian Paints Ltd.",
      "Industry": "Consumer Durables",
      "Symbol": "ASIANPAINT",
      "Market": "NSE"
    },
    {
      "Id": 5,
      "Company_Name": "Axis Bank Ltd.",
      "Industry": "Financial Services",
      "Symbol": "AXISBANK",
      "Market": "NSE"
    },
    {
      "Id": 6,
      "Company_Name": "Bajaj Auto Ltd.",
      "Industry": "Automobile and Auto Components",
      "Symbol": "BAJAJ-AUTO",
      "Market": "NSE"
    },
    {
      "Id": 7,
      "Company_Name": "Bajaj Finance Ltd.",
      "Industry": "Financial Services",
      "Symbol": "BAJFINANCE",
      "Market": "NSE"
    },
    {
      "Id": 8,
      "Company_Name": "Bajaj Finserv Ltd.",
      "Industry": "Financial Services",
      "Symbol": "BAJAJFINSV",
      "Market": "NSE"
    },
    {
      "Id": 9,
      "Company_Name": "Bharat Petroleum Corporation Ltd.",
      "Industry": "Oil Gas & Consumable Fuels",
      "Symbol": "BPCL",
      "Market": "NSE"
    },
    {
      "Id": 10,
      "Company_Name": "Bharti Airtel Ltd.",
      "Industry": "Telecommunication",
      "Symbol": "BHARTIARTL",
      "Market": "NSE"
    },
    {
      "Id": 11,
      "Company_Name": "Britannia Industries Ltd.",
      "Industry": "Fast Moving Consumer Goods",
      "Symbol": "BRITANNIA",
      "Market": "NSE"
    },
    {
      "Id": 12,
      "Company_Name": "Cipla Ltd.",
      "Industry": "Healthcare",
      "Symbol": "CIPLA",
      "Market": "NSE"
    },
    {
      "Id": 13,
      "Company_Name": "Coal India Ltd.",
      "Industry": "Oil Gas & Consumable Fuels",
      "Symbol": "COALINDIA",
      "Market": "NSE"
    },
    {
      "Id": 14,
      "Company_Name": "Divi's Laboratories Ltd.",
      "Industry": "Healthcare",
      "Symbol": "DIVISLAB",
      "Market": "NSE"
    },
    {
      "Id": 15,
      "Company_Name": "Dr. Reddy's Laboratories Ltd.",
      "Industry": "Healthcare",
      "Symbol": "DRREDDY",
      "Market": "NSE"
    },
    {
      "Id": 16,
      "Company_Name": "Eicher Motors Ltd.",
      "Industry": "Automobile and Auto Components",
      "Symbol": "EICHERMOT",
      "Market": "NSE"
    },
    {
      "Id": 17,
      "Company_Name": "Grasim Industries Ltd.",
      "Industry": "Construction Materials",
      "Symbol": "GRASIM",
      "Market": "NSE"
    },
    {
      "Id": 18,
      "Company_Name": "HCL Technologies Ltd.",
      "Industry": "Information Technology",
      "Symbol": "HCLTECH",
      "Market": "NSE"
    },
    {
      "Id": 19,
      "Company_Name": "HDFC Bank Ltd.",
      "Industry": "Financial Services",
      "Symbol": "HDFCBANK",
      "Market": "NSE"
    },
    {
      "Id": 20,
      "Company_Name": "HDFC Life Insurance Company Ltd.",
      "Industry": "Financial Services",
      "Symbol": "HDFCLIFE",
      "Market": "NSE"
    },
    {
      "Id": 21,
      "Company_Name": "Hero MotoCorp Ltd.",
      "Industry": "Automobile and Auto Components",
      "Symbol": "HEROMOTOCO",
      "Market": "NSE"
    },
    {
      "Id": 22,
      "Company_Name": "Hindalco Industries Ltd.",
      "Industry": "Metals & Mining",
      "Symbol": "HINDALCO",
      "Market": "NSE"
    },
    {
      "Id": 23,
      "Company_Name": "Hindustan Unilever Ltd.",
      "Industry": "Fast Moving Consumer Goods",
      "Symbol": "HINDUNILVR",
      "Market": "NSE"
    },
    {
      "Id": 24,
      "Company_Name": "ICICI Bank Ltd.",
      "Industry": "Financial Services",
      "Symbol": "ICICIBANK",
      "Market": "NSE"
    },
    {
      "Id": 25,
      "Company_Name": "ITC Ltd.",
      "Industry": "Fast Moving Consumer Goods",
      "Symbol": "ITC",
      "Market": "NSE"
    },
    {
      "Id": 26,
      "Company_Name": "IndusInd Bank Ltd.",
      "Industry": "Financial Services",
      "Symbol": "INDUSINDBK",
      "Market": "NSE"
    },
    {
      "Id": 27,
      "Company_Name": "Infosys Ltd.",
      "Industry": "Information Technology",
      "Symbol": "INFY",
      "Market": "NSE"
    },
    {
      "Id": 28,
      "Company_Name": "JSW Steel Ltd.",
      "Industry": "Metals & Mining",
      "Symbol": "JSWSTEEL",
      "Market": "NSE"
    },
    {
      "Id": 29,
      "Company_Name": "Kotak Mahindra Bank Ltd.",
      "Industry": "Financial Services",
      "Symbol": "KOTAKBANK",
      "Market": "NSE"
    },
    {
      "Id": 30,
      "Company_Name": "LTI Mindtree Ltd.",
      "Industry": "Information Technology",
      "Symbol": "LTIM",
      "Market": "NSE"
    },
    {
      "Id": 31,
      "Company_Name": "Larsen & Toubro Ltd.",
      "Industry": "Construction",
      "Symbol": "LT",
      "Market": "NSE"
    },
    {
      "Id": 32,
      "Company_Name": "Mahindra & Mahindra Ltd.",
      "Industry": "Automobile and Auto Components",
      "Symbol": "M&M",
      "Market": "NSE"
    },
    {
      "Id": 33,
      "Company_Name": "Maruti Suzuki India Ltd.",
      "Industry": "Automobile and Auto Components",
      "Symbol": "MARUTI",
      "Market": "NSE"
    },
    {
      "Id": 34,
      "Company_Name": "NTPC Ltd.",
      "Industry": "Power",
      "Symbol": "NTPC",
      "Market": "NSE"
    },
    {
      "Id": 35,
      "Company_Name": "Nestle India Ltd.",
      "Industry": "Fast Moving Consumer Goods",
      "Symbol": "NESTLEIND",
      "Market": "NSE"
    },
    {
      "Id": 36,
      "Company_Name": "Oil & Natural Gas Corporation Ltd.",
      "Industry": "Oil Gas & Consumable Fuels",
      "Symbol": "ONGC",
      "Market": "NSE"
    },
    {
      "Id": 37,
      "Company_Name": "Power Grid Corporation of India Ltd.",
      "Industry": "Power",
      "Symbol": "POWERGRID",
      "Market": "NSE"
    },
    {
      "Id": 38,
      "Company_Name": "Reliance Industries Ltd.",
      "Industry": "Oil Gas & Consumable Fuels",
      "Symbol": "RELIANCE",
      "Market": "NSE"
    },
    {
      "Id": 39,
      "Company_Name": "SBI Life Insurance Company Ltd.",
      "Industry": "Financial Services",
      "Symbol": "SBILIFE",
      "Market": "NSE"
    },
    {
      "Id": 40,
      "Company_Name": "State Bank of India",
      "Industry": "Financial Services",
      "Symbol": "SBIN",
      "Market": "NSE"
    },
    {
      "Id": 41,
      "Company_Name": "Sun Pharmaceutical Industries Ltd.",
      "Industry": "Healthcare",
      "Symbol": "SUNPHARMA",
      "Market": "NSE"
    },
    {
      "Id": 42,
      "Company_Name": "Tata Consultancy Services Ltd.",
      "Industry": "Information Technology",
      "Symbol": "TCS",
      "Market": "NSE"
    },
    {
      "Id": 43,
      "Company_Name": "Tata Consumer Products Ltd.",
      "Industry": "Fast Moving Consumer Goods",
      "Symbol": "TATACONSUM",
      "Market": "NSE"
    },
    {
      "Id": 44,
      "Company_Name": "Tata Motors Ltd.",
      "Industry": "Automobile and Auto Components",
      "Symbol": "TATAMOTORS",
      "Market": "NSE"
    },
    {
      "Id": 45,
      "Company_Name": "Tata Steel Ltd.",
      "Industry": "Metals & Mining",
      "Symbol": "TATASTEEL",
      "Market": "NSE"
    },
    {
      "Id": 46,
      "Company_Name": "Tech Mahindra Ltd.",
      "Industry": "Information Technology",
      "Symbol": "TECHM",
      "Market": "NSE"
    },
    {
      "Id": 47,
      "Company_Name": "Titan Company Ltd.",
      "Industry": "Consumer Durables",
      "Symbol": "TITAN",
      "Market": "NSE"
    },
    {
      "Id": 48,
      "Company_Name": "UPL Ltd.",
      "Industry": "Chemicals",
      "Symbol": "UPL",
      "Market": "NSE"
    },
    {
      "Id": 49,
      "Company_Name": "UltraTech Cement Ltd.",
      "Industry": "Construction Materials",
      "Symbol": "ULTRACEMCO",
      "Market": "NSE"
    },
    {
      "Id": 50,
      "Company_Name": "Wipro Ltd.",
      "Industry": "Information Technology",
      "Symbol": "WIPRO",
      "Market": "NSE"
    }
  ];