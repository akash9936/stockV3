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
            const header = rule.header
                .replace('{perc}', rule.metadata.compareWithValue);
            
            const stockDetails = 
                `- **Stock Symbol**: ${stockData.symbol || 'N/A'}\n` +
                `- **Current Price**: ${stockData.lastPrice || 'N/A'}\n` +
                `- **52-Week High**: ${stockData.yearHigh || 'N/A'}\n` +
                `- **52-Week Low**: ${stockData.yearLow || 'N/A'}\n`;

            if (!messages[header]) {
                messages[header] = [];
            }
            messages[header].push(stockDetails);
        }
    });

    const combinedMessages = Object.entries(messages).map(([header, stockMessages]) => {
        return `${header}\n\n${stockMessages.join('\n\n')}`;
    });

    return combinedMessages;
};

module.exports = { createAlertMessages };
