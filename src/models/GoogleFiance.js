const mongoose = require('mongoose');

const GoogleFiance = new mongoose.Schema({
    timestamp: String,
    data: [
        {
            symbol: String,
            lastPrice: Number
        }
    ]
});

module.exports = mongoose.model('Googlefiance', GoogleFiance);
