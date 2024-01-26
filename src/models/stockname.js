const mongoose = require('mongoose');

const stockNameSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model('stockname', stockNameSchema);;
