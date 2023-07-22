const express = require('express');
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(express.json());

const apiKey = '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';

app.post('/generate-completion', async (req, res) => {
  let maintest = new mainTest();
  let result;
  //  result=await maintest.getData(req.body);
  //  result=await maintest.translate(req.body);
  //  result=await maintest.googleSearchs(req.body.search);
  //  result=await maintest.youtube();
  //  result=await maintest.language();
   result=await maintest.currencyConversion(req.body);

   res.status(200).send(result);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


class mainTest {
  async getData(data) {

    try {
      const configuration = new Configuration({
        apiKey,
      });

      const openai = new OpenAIApi(configuration);

      const { model, prompt, max_tokens, temperature } = data;

      const response = await openai.createCompletion({
        model,
        prompt,
        max_tokens,
        temperature,
      });

      res.json(response.data);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  }


  async translate(data) {
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
      console.log(response.data.detections);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  //working
  async googleSearch(data) {
    const options = {
      method: 'GET',
      url: 'https://google-search72.p.rapidapi.com/search',
      params: {
        q: data,
        gl: 'us',
        lr: 'lang_en',
        num: '10',
        start: '0'
      },
      headers: {
        'X-RapidAPI-Key': '5922cb6c78mshde37b42ec0e679fp1f5d29jsn5a013e3b67cf',
        'X-RapidAPI-Host': 'google-search72.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      if (response.status == 200) {
        const data = response.data.items;
        data.forEach(datas => console.log(datas));
        return data;
      }
    } catch (error) {
      console.error(error);
    }
  }
  //working
  async youtube() {
    const options = {
      method: 'GET',
      url: 'https://youtube-v31.p.rapidapi.com/captions',
      params: {
        part: 'snippet',
        videoId: 'M7FIvfx5J10'
      },
      headers: {
        'X-RapidAPI-Key': '5922cb6c78mshde37b42ec0e679fp1f5d29jsn5a013e3b67cf',
        'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  //working
  async language() {
    const options = {
      method: 'POST',
      url: 'https://text-analysis12.p.rapidapi.com/language-detection/api/v1.1',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '5922cb6c78mshde37b42ec0e679fp1f5d29jsn5a013e3b67cf',
        'X-RapidAPI-Host': 'text-analysis12.p.rapidapi.com'
      },
      data: {
        text: 'Hello how are you? Have you heard about SpaceX?'
      }
    };

    try {
      const response = await axios.request(options);
      console.log(response.data.language_probability);
    } catch (error) {
      console.error(error);
    }
  }

  async currencyConversion(data) {
    const from = data.From;
    const to = data.To;
    const amount = data.Amount
    const option = {
      method: "GET",
      url: `https://api.apilayer.com/currency_data/convert?to=${to}&from=${from}&amount=${amount}`,
      headers: {
        apikey: "NNXlAbioQ7AUgQ80vlXXcTGT484AW4Ks"
      }
    }

    try {
      const response = await axios(option);
      const convertedAmount=Number(response.data.result).toFixed(2);
      if (response.status == 200) {
        console.log(`Converted value of ${amount} ${from} to ${to} is ${convertedAmount}.` );
      const  payload={
          amount: convertedAmount
        }
        return payload;
      }
      else {
        console.log("Currency not converted please try again ")
      }
    }
    catch (e) {
      console.log("Error " + e.error);
    }
  }

}