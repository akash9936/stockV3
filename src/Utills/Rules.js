const rules = (stock) => {
    let messages = [];

    // Rule: Notify if the stock price is within 5% of its all-time high.
    const checkAllTimeHigh = () => {
        const perc = 1;
        const percentageToHigh = ((stock.yearHigh - stock.lastPrice) / stock.yearHigh) * 100;

        if (percentageToHigh <= perc) {
            const message = `🚨 **All-Time High Alert within ${perc}%** 🚨\n` +
                `- **Stock Symbol**: ${stock.symbol}\n` +
                `- **Current Price**: ${stock.lastPrice}\n` +
                `- **All-Time High**: ${stock.yearHigh}\n` +
                `- **Details**: The stock price is close to its all-time high. Consider reviewing its performance.`;
            messages.push(message);
        }
    };

    // Check 52-Week Low
    const check52WeekLow = () => {
        const perc = 5;
        const percentageToLow = ((stock.lastPrice - stock.yearLow) / stock.yearLow) * 100;

        if (percentageToLow <= perc) {
            const message = `📉 **52-Week Low Alert within ${perc}%** 📉\n` +
                `- **Stock Symbol**: ${stock.symbol}\n` +
                `- **Current Price**: ${stock.lastPrice}\n` +
                `- **52-Week Low**: ${stock.yearLow}\n` +
                `- **Details**: The stock price has hit or is close to its 52-week low. Consider investigating further.`;
            messages.push(message);
        }
    };

    // Check Significant Change
    const checkSignificantChange = () => {
        const perc = 3;
        if (Math.abs(stock.pChange) >= perc) {
            const message = `⚠️ **Significant Price Change Alert (${perc}% or more)** ⚠️\n` +
                `- **Stock Symbol**: ${stock.symbol}\n` +
                `- **Current Price**: ${stock.lastPrice}\n` +
                `- **Previous Close**: ${stock.previousClose}\n` +
                `- **Change Percentage**: ${stock.pChange}%\n` +
                `- **Details**: The stock price has changed significantly today. Consider checking the reasons behind the move.`;
            messages.push(message);
        }
    };

    // Check Recent Performance
    const checkRecentPerformance = () => {
        const perc = 10;
        const percentageChange30d = stock.perChange30d;

        if (Math.abs(percentageChange30d) >= perc) {
            const message = `📈 **Recent Performance Alert (${perc}% or more in 30 days)** 📈\n` +
                `- **Stock Symbol**: ${stock.symbol}\n` +
                `- **Current Price**: ${stock.lastPrice}\n` +
                `- **Change in Last 30 Days**: ${percentageChange30d}%\n` +
                `- **Details**: The stock has seen a significant change in the last 30 days. Review recent performance trends.`;
            messages.push(message);
        }
    };

    // Check 365-Day Performance
    const check365DayPerformance = () => {
        const perc = 20;
        const percentageChange365d = stock.perChange365d;

        if (Math.abs(percentageChange365d) >= perc) {
            const message = `📈 **Annual Performance Alert (${perc}% or more in 365 days)** 📈\n` +
                `- **Stock Symbol**: ${stock.symbol}\n` +
                `- **Current Price**: ${stock.lastPrice}\n` +
                `- **Change in Last 365 Days**: ${percentageChange365d}%\n` +
                `- **Details**: The stock has experienced significant change over the past year. Consider reviewing long-term trends.`;
            messages.push(message);
        }
    };

    const checkCurrentPriceRelativeToDayHigh = () => {
        const perc = 5;
        const percentageToDayHigh = ((stock.dayHigh - stock.lastPrice) / stock.dayHigh) * 100;

        if (percentageToDayHigh <= perc) {
            const message = `🚀 **Close to Day High Alert (${perc}% or less)** 🚀\n` +
                `- **Stock Symbol**: ${stock.symbol}\n` +
                `- **Current Price**: ${stock.lastPrice}\n` +
                `- **Day High**: ${stock.dayHigh}\n` +
                `- **Details**: The stock price is close to its highest price of the day. Monitor for potential end-of-day trends.`;
            messages.push(message);
        }
    };

    // Execute all checks
    checkAllTimeHigh();
    // check52WeekLow();
    // checkSignificantChange();
    // checkRecentPerformance();
    // check365DayPerformance();
    // checkCurrentPriceRelativeToDayHigh();

    // Combine messages and return only the first 4000 characters
    const combinedMessages = messages.join('\n\n');
    return combinedMessages.substring(0, 500);
};

module.exports = { rules };
