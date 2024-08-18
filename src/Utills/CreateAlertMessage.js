const createAlertMessages = (ruleResults) => {
    if (!Array.isArray(ruleResults) || ruleResults.length === 0) {
        return 'No alerts to display.';
    }

    // Filter results to only include those with evaluateResult: true
    const filteredResults = ruleResults.filter(result => result.evaluateResult);

    // Process each filtered result
    const messages = {};
    filteredResults.forEach(result => {
        const stockData = result.stockData;
        const rule = result.rule;

        if (rule && rule.alertMessage) {
            const header = rule.header || '📉 **Alert** 📉';
            const stockMessage = rule.alertMessage
                .replace('{perc}', rule.metadata.compareWithValue)
                .replace('{symbol}', stockData.symbol || 'N/A') // Fallback value
                .replace('{lastPrice}', stockData.lastPrice || 'N/A') // Fallback value
                .replace('{yearHigh}', stockData.yearHigh || 'N/A')
                .replace('{yearLow}', stockData.yearLow || 'N/A'); // Fallback value

            if (!messages[header]) {
                messages[header] = [];
            }
            messages[header].push(stockMessage);
        }
    });

    const combinedMessages = Object.entries(messages).map(([header, stockMessages]) => {
        return `${header}\n\n${stockMessages.join('\n\n')}`;
    });

    return combinedMessages;
};

module.exports = { createAlertMessages };
