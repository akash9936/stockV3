// serverLogic.js
const fetchData = require('./getNSEIndiaData');
const { Mapper } = require('./Utills/Mappper');
const { TeleGramBot } = require('./TeleGramBot')
const { evaluateRules } = require('./ProcessRules');
const { createAlertMessages } = require('./Utills/CreateAlertMessage');
const fetchDataCronTime = 60000;

function startServer() {
    console.log('NseIndiaMain Started');
    setInterval(async () => {
        try {
            const data = await fetchData();
            console.log(`Data: ${JSON.stringify(data)}`);
            if (data) {
                let simplifiedData = Mapper.dataMapper(data);
                let evaluateRuless = await evaluateRules(simplifiedData);
                const trueData = evaluateRuless.filter(data => data.evaluateResult);
                let alertMessages = await createAlertMessages(trueData);
                await TeleGramBot(alertMessages);
                console.log('Data processing completed.');
            } else {
                console.error('Error: Data is not available.');
            }
        } catch (error) {
            console.error('Error fetching or processing data:', error.message);
        }
    }, fetchDataCronTime);
}

module.exports = { startServer };
