const rules = (stock) => {
    let messages = [];

    // Rule: Notify if the stock price is within 5% of its all-time high.
    const checkAllTimeHigh = () => {
        const perc=5;
        const percentageToHigh = ((stock.yearHigh - stock.lastPrice) / stock.yearHigh) * 100;
     //   console.log('Message percentageToHigh:', percentageToHigh); // Log message for debugging

        let message=``
        if (percentageToHigh <= perc) {
             message = `🚨 **All-Time High Alert within ${5} perc** 🚨\n` +
                            `- **Stock Symbol**: ${stock.symbol}\n` +
                            `- **Current Price**: ${stock.lastPrice}\n` +
                            `- **All-Time High**: ${stock.yearHigh}\n` +
                            `- **Details**: The stock price is close to its all-time high. Consider reviewing its performance.`;
            messages.push(message);
        }
        else{
            message=`Not Found: the stock price is within ${perc} of its all-time high. `
            messages.push(message);
        }
    };

    // Notify if the stock price hits or is within 5% of its 52-week low.
    const check52WeekLow = () => {
        const percentageToLow = ((stock.lastPrice - stock.yearLow) / stock.yearLow) * 100;
        if (percentageToLow <= 5) {
            const message = `📉 **52-Week Low Alert** 📉\n` +
                            `- **Stock Symbol**: ${stock.symbol}\n` +
                            `- **Current Price**: ${stock.lastPrice}\n` +
                            `- **52-Week Low**: ${stock.yearLow}\n` +
                            `- **Details**: The stock price has hit or is close to its 52-week low. Consider investigating further.`;
            messages.push(message);
        }
    };

    // Notify if the stock price changes by more than 3% in a single day.
    const checkSignificantChange = () => {
        if (Math.abs(stock.pChange) >= 3) {
            const message = `⚠️ **Significant Price Change Alert** ⚠️\n` +
                            `- **Stock Symbol**: ${stock.symbol}\n` +
                            `- **Current Price**: ${stock.lastPrice}\n` +
                            `- **Previous Close**: ${stock.previousClose}\n` +
                            `- **Change Percentage**: ${stock.pChange}%\n` +
                            `- **Details**: The stock price has changed significantly today. Consider checking the reasons behind the move.`;
            messages.push(message);
        }
    };

    // Execute all checks
    checkAllTimeHigh();
    // check52WeekLow();
    // checkSignificantChange();

    return messages;
};

module.exports = { rules };
