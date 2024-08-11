const createAlertMessages = (ruleResults) => {
  if (!Array.isArray(ruleResults) || ruleResults.length === 0) {
      return 'No alerts to display.';
  }

  // Filter results to only include those with evaluateResult: true
  const filteredResults = ruleResults.filter(result => result.evaluateResult);

  // Process each filtered result
  const messages = filteredResults.map(result => {
      const stockData = result.stockData;
      const rule = result.rule;
      if (rule && rule.alertMessage) {
          return rule.alertMessage
              .replace('{perc}', rule.metadata.compareWithValue)
              .replace('{symbol}', stockData.symbol || 'N/A') // Fallback value
              .replace('{lastPrice}', stockData.lastPrice || 'N/A') // Fallback value
              .replace('{yearHigh}', stockData.yearHigh || 'N/A'); // Fallback value
      }
      return null;
  }).filter(Boolean); // Filter out any null messages

  return messages;
};

module.exports = { createAlertMessages };
