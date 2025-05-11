const axios = require('axios');
const tough = require('tough-cookie');
const cookieJar = new tough.CookieJar();
let count = 1;

// Function to get cookies first
async function getCookies() {
    try {
        const response = await axios.get('https://www.nseindia.com/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            },
            timeout: 30000,
            maxRedirects: 5
        });
        
        // Extract cookies from response
        const cookies = response.headers['set-cookie'];
        if (cookies) {
            cookies.forEach(cookie => {
                cookieJar.setCookieSync(cookie, 'https://www.nseindia.com');
            });
        }
        
        // Add delay to mimic human behavior
        await new Promise(resolve => setTimeout(resolve, 2000));
        return true;
    } catch (error) {
        console.error('Error fetching cookies:', error.message);
        return false;
    }
}

async function fetchData() {
    return new Promise(async (resolve, reject) => {
        try {
            // First get cookies
            await getCookies();
            
            // Linux/Ubuntu compatible user agent
            const config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050',
                headers: {
                    'authority': 'www.nseindia.com',
                    'accept': '*/*',
                    'accept-language': 'en-US,en;q=0.9',
                    'cookie': cookieJar.getCookieStringSync('https://www.nseindia.com'),
                    'dnt': '1',
                    'referer': 'https://www.nseindia.com/market-data/live-equity-market',
                    'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Linux"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
                },
                timeout: 30000
            };

            const response = await axios.request(config);
            console.log("-----------------------------------------------------" + count);
            count++;
            resolve(response.data);
        } catch (error) {
            if (error.response) {
                console.log(`[${new Date().toISOString()}] Response error: ${error.response.status}`);
                if (error.response.status === 401 || error.response.status === 403) {
                    console.log(`Retrying with new cookies after 5 seconds...`);
                    setTimeout(() => {
                        fetchData().then(resolve).catch(reject);
                    }, 5000);
                } else {
                    reject(error);
                }
            } else if (error.request) {
                console.log(`[${new Date().toISOString()}] Request error: ${error.message}`);
                setTimeout(() => {
                    fetchData().then(resolve).catch(reject);
                }, 5000);
            } else {
                reject(error);
            }
        }
    });
}

module.exports = fetchData;