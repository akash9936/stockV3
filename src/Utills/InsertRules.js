const mongoose = require('mongoose');
const Rule = require('./../models/RulesModel'); // Ensure the path is correct

// Function to insert sample rule data
async function insertSampleData() {
  try {
    // Define the sample rule data
    const sampleRule = new Rule({
      ruleId: '1',
      header: 'All-Time High Alert',
      description: 'Alert when the stock price is within a certain percentage of its all-time high.',
      frequency: 60,
      lastExecuted: null,
      dataPoints: ['lastPrice', 'yearHigh'],
      alertMessage: '🚨 **All-Time High Alert within {perc}%** 🚨\n- **Stock Symbol**: {symbol}\n- **Current Price**: {lastPrice}\n- **All-Time High**: {yearHigh}\n- **Details**: The stock price is close to its all-time high. Consider reviewing its performance.',
      stockExchange: ['NSE50'],
      EnableForUI: true,
      EnableTeleGram: true,
      isActive: true,
      CronValue: '',
      metadata: {
        formula: '(yearHigh - lastPrice) / yearHigh * 100', // Ensure this formula is valid for your use case
        compareWithValue: 5,
        comparisonOperator: '<=' // Ensure this operator is valid for your use case
      },
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save the sample rule to the database
    await sampleRule.save();
    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
}

// Export the function for use in other modules
module.exports = { insertSampleData };
