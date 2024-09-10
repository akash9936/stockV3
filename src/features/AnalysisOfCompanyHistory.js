const axios = require('axios');
const tough = require('tough-cookie');
const cookieJar = new tough.CookieJar();
let count = 1;

const url = 'https://www.nseindia.com/api/corp-info?symbol=MAHEPC&corpType=financialResult&market=equities';
    console.log("cookes are    ",cookieJar.getCookieStringSync('https://www.nseindia.com/get-quotes/equity'))
const headers = {
    'accept': '*/*',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
  //  'cookie': cookieJar.getCookieStringSync('https://www.nseindia.com'),
    'cookie': 'defaultLang=en; _ga=GA1.1.267158724.1724016624; nsit=KoYBL7krKvPMJZEQ6TTwkZIb; bm_mi=7D61DC2CB453B520AEAB2EDB9FCAC38C~YAAQVYgsMSCmnmCRAQAATHhmZxhjI7vDv7CbTIJaxPZJiz8FeZqro554E4R2C+ae1zDgIo2RJ2Qio6EPq4pUS22xe+iboAH4UzPcXXUWOwjEKDH+Eu3WCWtZD7+GQilINRV0JF4RIAHSn60ljP8A8LRwmSHSJcSwzoMyBm39CD+W1fpeffackZTUB5WERGg/k7GcpeoxeJmCcIo6DKcWhUry+0Ym+YpCMEHe3j9B19CvHSV5uT0wIgPmy/uAmE5WTCYHfI/DjsLbvv30x3xVJkeY9l8Oux5r/IvysVQOXLAbFfTcrou7LjKwSGSqneNANYAozgketZNM5zs9WJNzFw==~1; nseQuoteSymbols=[{"symbol":"MAHEPC","identifier":null,"type":"equity"}]; ak_bmsc=753994C71C90DCFC0A9A1BE9404DAE45~000000000000000000000000000000~YAAQVYgsMUWmnmCRAQAA6HxmZxgaOH7yPhudYSx+mgIAAjxev8TmrzqagK+2d+8QJOrzhFqrP6OR9NjR84IyfN9YCv0z77eFnzpAUzpsTMarTzgczF7HdoToL3nDYUPPGVfKJbm8uqnoa4Of/gI2P+gsJzv2VEQ9S645KqLzk/ggv7n5qC8L0jQMZq+l6kK3gLVtQ6X37Zm3es0dO/6e65nnBuXGy9IGa+ZOwrxut0mkOvXcf4foPHznlelA7Uldhoieym1dy6XbiliQhIYTGKZkOCb7fJGkFfIHC/A5DXnYJHm5tTKS4mm2z/bkpY+fzwMkAqfvQoNgco/vMrJAZbKQaeDq7Aq6+KNEFWfiOoEkZa/MHesoDVctLhIs4g5a0frSvBQbVuhcbMRygbk2SCj0DF43SjLzOaucgMnaqCKTOkeaJgRJIqijrg6HW5I+/Iu30kVEMg8C2VaDPfKSQWGTZFdG7ga2ZlRlMHLZbDNwgk/6ujp6dulVuuSlMaNR; _abck=C37534EEB42212E274135A71915F2712~0~YAAQVYgsMUemnmCRAQAAm35mZwyY7bhTQ9dSOJ2XmZPS412/6m0d+PU4m60RECzQVeOIYsJSyyU5N9ruQ+Ds3nCq5Pta6RBvvOdmhCyRWm7xJxsbvw7I9f055QW8S49TuQaOXlC0Nx6ksjOgcl+I0MpUbkflRlj9vxISQfVvgj05xCNJ7fRSago+YwqNR6QP00H/XEiQl+swiDPF7FGa66SdYBKAazCwLL1GZjG+W+j21YIP/bRvHeQjcPJuYkG7JttC47iRVZPirOeomDHswHpyrtwQ30csQEOdt4eMuOZWwzOMuPQDcboPHxnJG9mMUQJiZYUr57nwhxe3EbaGZhMdZYipOK6sFAjcjWuOzklfspafBfGFHjmF90wkS9rxJtqyWfMLedy0jM6OQKWmBcGzsDVQFbm1TzQ=~-1~||-1||~-1; nseappid=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcGkubnNlIiwiYXVkIjoiYXBpLm5zZSIsImlhdCI6MTcyNDAxNjk0MSwiZXhwIjoxNzI0MDI0MTQxfQ.CEBzWE8yJQZPu2wqC4hgt7YbfUh7fj0Fu-V11d0ZugA; bm_sz=9AB3C35A989C771ECBE31F87166B910A~YAAQX18sMYNyrWCRAQAAkpiXZxjWef3n+Kg8nkLAO8at5z6IgkKEdzwesPfu8TB1W9AjMT9yaJ1vZvIe1bOKMAhpHO5oy4CH0NI6fILFi1iFqJLRrj5tWTZ2kAlp3bzwYC/7vnmaNnEqgkxQEwqmjXhb85HMuGpYJWTa9+8PQT5198o7NWcQlpJGY7BYP4fNu00y4DXor6v2NZd8d7oMEvBfd65SNBBD8NHOTjY7vXvoX5+Q/QSCYyLuSUVs1XIvGCDgSedP/ZsEG7ImoWK1QjuAKALnR4JHKAVxC2aep7yCh+egtAcVkeyFLXwbHy4tUFVylmQJ0odsaAmPNSeqqwnyUWOzfgK6YFPAQHpRdi0lDMF1Nz33CZ5ls9e5Vl+N022ZCTWb7FaSdTY1/sJxiq0JuKMLP5xSvc8ukEeHqCdYk+bq7HVlhRTqm9VHdRcWa7NysVvDK8K+rep9rxdA7Q==~4276535~4601411; _ga_87M7PJ3R97=GS1.1.1724019814.2.1.1724021924.60.0.0; bm_sv=AE389519A0537E71B2B07E1268557480~YAAQDIgsMQRnvV6RAQAAGle3ZxhJJ5KI+DLiiwsskrxw8yZMYAt3PZhNCgLldn6ZLPOJvTJS1xiqDCaQhysYc3bpJ7RVSPRwq6nqZBDlWSYgFcVLB94h0iEyUovqLOviGu3iDI4o1WO1w/ugqF9IbjJSU1VeWfnR6YJayBD1T0O0jkJAgREO0e90rcta3MKYfoCp+iNryT1T3vs4HXJJnQutGz8heAU5pIu2aVuCdsqBxuWUPRR9yakZNhqyoCxQE+7+BA==~1; RT="z=1&dm=nseindia.com&si=f000f6f4-5848-4854-9503-bd1c2461580c&ss=m00369ws&sl=0&se=8c&tt=0&bcn=%2F%2F684d0d4a.akstat.io%2F&nu=3bsqukz2&cl=2zkh8"; _abck=C37534EEB42212E274135A71915F2712~-1~YAAQVYgsMf1Tn2CRAQAAedO3ZwwCFgR9cPT14GlqMOYFBFItjc4oYYzT3Rctb6EWV97zpU460akirYTYgXe4QvWIv14JiSadl3NGYKQziSshnsBpmrd5aCB6JQIAw2iJivTwHER9gEdcr0tDoz3+DhAq3aADhqhZU2dvESTxxWiP/1MCS0ZB6EZgpEr/OZvckrMkDPVTvs1NbH0BGN0I5jQq+D5O/jdnRm6/CTVckRkyhayrSus8lFyoAcIDtOcGceuLQX6eos2jnHnYynLx058g115STizMEhxszyu3twRIblWr+3DXuiBwSlwhOPg2h/cuCKAvGzsOJEmKsOS2u/xL2oKpSWB80Q4w99pMT4B3XVgIxXyTUwxhXeVK8zRExMHWp0qNL1KPZf7b+db7MQvUL6ILXk8/8L0=~0~-1~-1; bm_sv=AE389519A0537E71B2B07E1268557480~YAAQVYgsMf5Tn2CRAQAAedO3ZxiR3AasaAP14t8ylo8X/maXJ2YH4I6rK6lyF8+/5nvR0IAYeFIzgdHCpzXIBcu9xnU0Ca1A7+vx1UNNE/17NV9yk2U52Rg8HTeJIMdDnXx8ysdBNaJLSoMmVzfqCDZpUc9gehQ6Qf+G8Pu0Vh/nihI2oYdFm/PsAnD4PXp+qW13MzK4rQ0Z2ZX8yRWr4rUtBaVs/58kr/EmditxYkyhFrw1xdUZ/wZKjYCIe8akqG6Y4Q==~1',

    'priority': 'u=1, i',
    'referer': 'https://www.nseindia.com/get-quotes/equity?symbol=MAHEPC',
    'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
};

async function fetchDataForTopCorpInfo() {
    try {
        const response = await axios.get(url, { headers });
        console.log('Data:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

module.exports={fetchDataForTopCorpInfo};
