const mongoose = require('mongoose');

const NSE50Data = new mongoose.Schema({
    timestamp: String,
    data: [
        {
            symbol: String,
            lastPrice: Number
        }
    ]
});

module.exports = mongoose.model('NSE50', NSE50Data);
