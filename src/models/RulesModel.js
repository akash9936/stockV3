const mongoose = require('mongoose');

const rulesSchema = new mongoose.Schema({
  ruleId: { type: String, required: true },
  header: { type: String, required: true },
  description: { type: String, required: true },
  frequency: { type: Number, required: true },
  lastExecuted: { type: Date, default: null },
  dataPoints: { type: [String], required: true },
  alertMessage: { type: String, required: true },
  stockExchange: { type: [String], required: true },
  EnableForUI: { type: Boolean, default: true },
  EnableTeleGram: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  CronValue: { type: String, default: '' },
  metadata: {
    formula: { type: String, required: true }, // e.g., "(yearHigh - lastPrice) / yearHigh * 100"
    compareWithValue: { type: Number, required: true },
    comparisonOperator: { type: String, required: true, enum: ['<', '<=', '>', '>=', '==', '!='] }
  },
  createdBy: { type: String, default: 'system' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  comment: { type: String, default: '' }
});

module.exports = mongoose.model('Rule', rulesSchema);
