// growwStock.js
const axios = require('axios');
const tough = require('tough-cookie');
const cookieJar = new tough.CookieJar();
let count = 1;

function fetchData() {
    return new Promise(async (resolve, reject) => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050',
            headers: {
                'authority': 'www.nseindia.com',
                'accept': '*/*',
                'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                'cookie': cookieJar.getCookieStringSync('https://www.nseindia.com'),
                'dnt': '1',
                'referer': 'https://www.nseindia.com/market-data/live-equity-market',
                'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
            },
            timeout:30000
        };

       await axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                resolve(response.data);  // Resolve with the data
                console.log("-----------------------------------------------------" + count);
                count++;
            })
            .catch((error) => {
                if (error.response && error.response.status !== 200) {
                    console.log(`[${new Date().toISOString()}] Received 401 Unauthorized error. Retrying after 1 second...`);
                    setTimeout(() => {
                        fetchData().then(resolve).catch(reject); // Retry after 1 second
                    }, 10000);
                } else {
                    reject(error);
                }
            });
    });
}

module.exports = fetchData;
