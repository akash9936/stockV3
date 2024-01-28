const mongoose = require('mongoose');

const NSE50DataV2 = new mongoose.Schema({
  priority: { type: Number },
  symbol: { type: String },
  identifier: { type: String },
  open: { type: Number },
  dayHigh: { type: Number },
  dayLow: { type: Number },
  lastPrice: { type: Number },
  previousClose: { type: Number },
  change: { type: Number },
  pChange: { type: Number },
  ffmc: { type: Number },
  yearHigh: { type: Number },
  yearLow: { type: Number },
  totalTradedVolume: { type: Number },
  totalTradedValue: { type: Number },
  lastUpdateTime: { type: String },
  nearWKH: { type: Number },
  nearWKL: { type: Number },
  perChange365d: { type: Number },
  date365dAgo: { type: String },
  chart365dPath: { type: String },
  date30dAgo: { type: String },
  perChange30d: { type: Number },
  chart30dPath: { type: String },
  chartTodayPath: { type: String },
});

const FinancialDataModel = mongoose.model('NSE50V2', NSE50DataV2);

module.exports = FinancialDataModel;
