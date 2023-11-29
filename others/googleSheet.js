const express = require('express');
const { google } = require('googleapis');
const credentials = require('./sheetCredV2.json');
const app = express();
const port = 4000;

app.get('/getStockData', async (req, res) => {
    try {
        const auth = new google.auth.JWT({
            email: credentials.web.client_email,
            key: credentials.web.private_key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const spreadsheetId = "40418DHGKhppP6nxL7dkXCdD6Qj00qPw_-HAXM8z0IPhtqw721";
        const range = "Sheet1!A1:A3";

        const result = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        const data = result.data.values;
        console.log('Data from Google Sheets:', data);
        res.status(200).json({ data });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
