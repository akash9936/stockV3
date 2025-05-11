const axios = require('axios');
const tough = require('tough-cookie');
const https = require('https');
const cookieJar = new tough.CookieJar();
let count = 1;

// Create custom axios instance with keep-alive agent
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({ 
        keepAlive: true,
        timeout: 60000,
        maxSockets: 10,
        maxFreeSockets: 5,
        keepAliveMsecs: 30000
    }),
    timeout: 30000,
    maxRedirects: 10
});

// Add retry interceptor
axiosInstance.interceptors.response.use(undefined, async (err) => {
    const config = err.config;
    
    // If config doesn't exist or retry option is not set, reject
    if(!config || !config.retry) {
        return Promise.reject(err);
    }
    
    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;
    
    // Check if we've maxed out the total number of retries
    if(config.__retryCount >= config.retry) {
        return Promise.reject(err);
    }
    
    // Increase the retry count
    config.__retryCount += 1;
    
    // Log the retry attempt
    console.log(`Retry attempt ${config.__retryCount}/${config.retry} for ${config.url}`);
    
    // Create new promise to handle backoff
    const backoff = new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Retrying request after ${config.retryDelay}ms delay`);
            resolve();
        }, config.retryDelay || 3000);
    });
    
    // Wait for the backoff time, then retry
    await backoff;
    return axiosInstance(config);
});

// Function to get cookies with multiple retries
async function getCookies(retries = 5) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`[${new Date().toISOString()}] Attempting to get cookies (attempt ${i+1}/${retries})`);
            
            const response = await axiosInstance.get('https://www.nseindia.com/', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Pragma': 'no-cache',
                    'Upgrade-Insecure-Requests': '1'
                },
                retry: 3,
                retryDelay: 3000
            });
            
            // Extract cookies from response
            const cookies = response.headers['set-cookie'];
            if (cookies) {
                cookies.forEach(cookie => {
                    cookieJar.setCookieSync(cookie, 'https://www.nseindia.com');
                });
                console.log(`[${new Date().toISOString()}] Successfully retrieved cookies`);
                
                // Add delay to mimic human behavior
                await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
                return true;
            }
            
            console.log(`[${new Date().toISOString()}] No cookies received, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 3000 + (i * 1000)));
        } catch (error) {
            const delay = 3000 + (i * 2000); // Increase delay with each retry
            console.error(`[${new Date().toISOString()}] Error fetching cookies (attempt ${i+1}/${retries}):`, error.message);
            
            if (i < retries - 1) {
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('Maximum retry attempts reached for cookies');
                return false;
            }
        }
    }
    return false;
}

async function fetchData() {
    return new Promise(async (resolve, reject) => {
        try {
            // First get cookies
            const cookiesObtained = await getCookies();
            if (!cookiesObtained) {
                throw new Error('Failed to obtain cookies after multiple attempts');
            }
            
            // Random delay between cookie fetch and data request
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
            
            // Linux/Ubuntu compatible user agent
            const config = {
                method: 'get',
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
                    'cache-control': 'no-cache',
                    'pragma': 'no-cache',
                    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
                },
                retry: 5,
                retryDelay: 5000
            };

            const response = await axiosInstance.request(config);
            console.log(`[${new Date().toISOString()}] Data fetched successfully --------- ${count}`);
            count++;
            resolve(response.data);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Failed to fetch data after multiple attempts:`, error.message);
            reject(error);
        }
    });
}

module.exports = fetchData;