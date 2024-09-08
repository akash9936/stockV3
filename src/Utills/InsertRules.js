const mongoose = require('mongoose');
const Rule = require('./../models/RulesModel'); // Ensure the path is correct

// Function to insert sample rule data
async function insertSampleData() {
  try {
    // Sample rule for All-Time Low Alert
    // const allTimeLowAlert = new Rule({

        //   ruleId: '1',
    //   header: 'All-Time High Alert',
    //   description: 'Alert when the stock price is within a certain percentage of its all-time high.',
    //   frequency: 60,
    //   lastExecuted: null,
    //   dataPoints: ['lastPrice', 'yearHigh'],
    //   alertMessage: '🚨 **All-Time High Alert within {perc}%** 🚨\n- **Stock Symbol**: {symbol}\n- **Current Price**: {lastPrice}\n- **All-Time High**: {yearHigh}\n- **Details**: The stock price is close to its all-time high. Consider reviewing its performance.',
    //   stockExchange: ['NSE50'],
    //   EnableForUI: true,
    //   EnableTeleGram: true,
    //   isActive: true,
    //   CronValue: '',
    //   metadata: {
    //     formula: '(yearHigh - lastPrice) / yearHigh * 100', // Ensure this formula is valid for your use case
    //     compareWithValue: 5,
    //     comparisonOperator: '<=' // Ensure this operator is valid for your use case
    //   },
    //   createdBy: 'system',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // });
    //   ruleId: '2',
    //   header: 'All-Time Low Alert',
    //   description: 'Alert when the stock price is within a certain percentage of its all-time low.',
    //   frequency: 60,
    //   lastExecuted: null,
    //   dataPoints: ['lastPrice', 'yearLow'],
    //   alertMessage: '📉 **All-Time Low Alert within {perc}%** 📉\n- **Stock Symbol**: {symbol}\n- **Current Price**: {lastPrice}\n- **All-Time Low**: {yearLow}\n- **Details**: The stock price is close to its all-time low. Consider reviewing its performance.',
    //   stockExchange: ['NSE50'],
    //   EnableForUI: true,
    //   EnableTeleGram: true,
    //   isActive: true,
    //   CronValue: '',
    //   metadata: {
    //     formula: '(lastPrice - yearLow) / yearLow * 100',
    //     compareWithValue: 5,
    //     comparisonOperator: '<='
    //   },
    //   createdBy: 'system',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // });

    // Sample rule for Significant Price Change Alert
    const significantPriceChangeAlert = new Rule({
      ruleId: '3',
      header: '**Significant Price Change Alert ({perc}% or more)**',
      description: 'Alert when the stock price changes significantly within a day.',
      frequency: 60,
      lastExecuted: null,
      dataPoints: ['lastPrice', 'previousClose', 'pChange'],
      alertMessage: '⚠️ ⚠️\n- **Stock Symbol**: {symbol}\n- **Current Price**: {lastPrice}\n- **Previous Close**: {previousClose}\n- **Change Percentage**: {pChange}%\n- **Details**: The stock price has changed significantly today. Consider checking the reasons behind the move.',
      stockExchange: ['NSE50'],
      EnableForUI: true,
      EnableTeleGram: true,
      isActive: true,
      CronValue: '',
      metadata: {
        formula: 'Math.abs(pChange)',
        compareWithValue: 3,
        comparisonOperator: '>='
      },
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Sample rule for Recent Performance Alert
    const recentPerformanceAlert = new Rule({
      ruleId: '4',
      header: '**Recent Performance Alert ({perc}% or more in 30 days)**',
      description: 'Alert when the stock price changes significantly within the last 30 days.',
      frequency: 60,
      lastExecuted: null,
      dataPoints: ['lastPrice', 'perChange30d'],
      alertMessage: '📈  📈\n- **Stock Symbol**: {symbol}\n- **Current Price**: {lastPrice}\n- **Change in Last 30 Days**: {perChange30d}%\n- **Details**: The stock has seen a significant change in the last 30 days. Review recent performance trends.',
      stockExchange: ['NSE50'],
      EnableForUI: true,
      EnableTeleGram: true,
      isActive: true,
      CronValue: '',
      metadata: {
        formula: 'Math.abs(perChange30d)',
        compareWithValue: 10,
        comparisonOperator: '>='
      },
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Sample rule for Annual Performance Alert
    const annualPerformanceAlert = new Rule({
      ruleId: '5',
      header: '**Annual Performance Alert ({perc}% or more in 365 days)**',
      description: 'Alert when the stock price changes significantly within the last 365 days.',
      frequency: 60,
      lastExecuted: null,
      dataPoints: ['lastPrice', 'perChange365d'],
      alertMessage: '📈  📈\n- **Stock Symbol**: {symbol}\n- **Current Price**: {lastPrice}\n- **Change in Last 365 Days**: {perChange365d}%\n- **Details**: The stock has experienced significant change over the past year. Consider reviewing long-term trends.',
      stockExchange: ['NSE50'],
      EnableForUI: true,
      EnableTeleGram: true,
      isActive: true,
      CronValue: '',
      metadata: {
        formula: 'Math.abs(perChange365d)',
        compareWithValue: 20,
        comparisonOperator: '>='
      },
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Sample rule for Close to Day High Alert
    const closeToDayHighAlert = new Rule({
      ruleId: '6',
      header: '**Close to Day High Alert ({perc}% or less)**',
      description: 'Alert when the stock price is close to its highest price of the day.',
      frequency: 60,
      lastExecuted: null,
      dataPoints: ['lastPrice', 'dayHigh'],
      alertMessage: '🚀  🚀\n- **Stock Symbol**: {symbol}\n- **Current Price**: {lastPrice}\n- **Day High**: {dayHigh}\n- **Details**: The stock price is close to its highest price of the day. Monitor for potential end-of-day trends.',
      stockExchange: ['NSE50'],
      EnableForUI: true,
      EnableTeleGram: true,
      isActive: true,
      CronValue: '',
      metadata: {
        formula: '((dayHigh - lastPrice) / dayHigh) * 100',
        compareWithValue: 5,
        comparisonOperator: '<='
      },
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save the sample rules to the database
    // await allTimeLowAlert.save();
    await significantPriceChangeAlert.save();
    await recentPerformanceAlert.save();
    await annualPerformanceAlert.save();
    await closeToDayHighAlert.save();

    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
}

// Export the function for use in other modules
module.exports = { insertSampleData };
