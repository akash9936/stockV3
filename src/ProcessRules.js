const Rule = require('./models/RulesModel');


// Function to evaluate a single rule
const evaluateRule = (rule, stock) => {
    let { formula, compareWithValue, comparisonOperator } = rule.metadata;
    // compareWithValue=2;
  
    // Assuming stock is an array with one object
    const stockData = stock; // Access the first element in the data array
  
    // Replace placeholders in formula with actual stock data
    const formulaWithStockData = formula.replace(/(\w+)/g, (match) => {
      // Check if the placeholder matches a key in the stockData
      return stockData[match] !== undefined ? stockData[match] : match;
    });
  
    // console.error('formulaWithStockData evaluating rules:', formulaWithStockData);
    // console.error('stockData evaluating rules:', stockData);
  
    let result;
    try {
      const formulaFunction = new Function('return ' + formulaWithStockData);
      result = formulaFunction();
    } catch (error) {
      throw new Error(`Error evaluating formula: ${error.message}`);
    }
  
    // Compare the result based on the comparison operator
    let comparisonResult;
    switch (comparisonOperator) {
      case '<':
        comparisonResult = result < compareWithValue;
        break;
      case '<=':
        comparisonResult = result <= compareWithValue;
        break;
      case '>':
        comparisonResult = result > compareWithValue;
        break;
      case '>=':
        comparisonResult = result >= compareWithValue;
        break;
      case '==':
        comparisonResult = result == compareWithValue;
        break;
      case '!=':
        comparisonResult = result != compareWithValue;
        break;
      default:
        throw new Error(`Unsupported comparison operator: ${comparisonOperator}`);
    }
    return comparisonResult;
    

  };
  

// Function to evaluate all rules
const evaluateRules = async (stock) => {
  try {
    evaluateRulesResult=[];
    const rules = await Rule.find({ isActive: true });
    // console.error('stockData.data evaluating rules:', stock.data);

    for (let stocks of stock.data) {
        const results = await Promise.all(
            rules.map(async (rule) => {
                const evaluateResult = await evaluateRule(rule, stocks);
                return {
                    evaluateResult: evaluateResult,
                    stockData: stocks,
                    rule: rule
                };
            })
        );
        evaluateRulesResult.push(...results);
    }


    return evaluateRulesResult;
  } catch (error) {
    console.error('Error evaluating rules:', error);
    throw error;
  }
};

module.exports ={evaluateRules}
