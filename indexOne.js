const axios = require('axios');
const { Response, Request } = require('express');

class detailsData {
    async getData() {
        const options = {
            method: 'GET',
            url: 'https://openai80.p.rapidapi.com/models',
            headers: {
                'X-RapidAPI-Key': '5922cb6c78mshde37b42ec0e679fp1f5d29jsn5a013e3b67cf',
                'X-RapidAPI-Host': 'openai80.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async getTranslate() {

        const encodedParams = new URLSearchParams();
        encodedParams.set('source_language', 'en');
        encodedParams.set('target_language', 'id');
        encodedParams.set('text', 'What is your name?');

        const options = {
            method: 'POST',
            url: 'https://text-translator2.p.rapidapi.com/translate',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': '5922cb6c78mshde37b42ec0e679fp1f5d29jsn5a013e3b67cf',
                'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
            },
            data: encodedParams,
        };

        try {
            const response = await axios.request(options);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async getcurrency() {
        const axios = require('axios');

        const options = {
            method: 'GET',
            url: 'https://currency-converter5.p.rapidapi.com/currency/convert',
            params: {
                format: 'json',
                from: 'AUD',
                to: 'CAD',
                amount: '1'
            },
            headers: {
                'X-RapidAPI-Key': '5922cb6c78mshde37b42ec0e679fp1f5d29jsn5a013e3b67cf',
                'X-RapidAPI-Host': 'currency-converter5.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async sendEmail(){
        const encodedParams = new URLSearchParams();
        encodedParams.set('q', 'English is hard, but detectably so');
        
        const options = {
          method: 'POST',
          url: 'https://google-translate1.p.rapidapi.com/language/translate/v2/detect',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'application/gzip',
            'X-RapidAPI-Key': '5922cb6c78mshde37b42ec0e679fp1f5d29jsn5a013e3b67cf',
            'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
          },
          data: encodedParams,
        };
        
        try {
            const response = await axios.request(options);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }}
}

const instance = new detailsData();
instance.sendEmail();
