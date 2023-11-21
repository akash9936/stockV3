const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/getData', async (req, res) => {
    try {
        const SHEET_ID = '18DHGKhppP6nxL7dkXCdD6Qj00qPw_-HAXM8z0IPhtqw';
        const SHEET_TITLE = 'Sheet1';
        const SHEET_RANGE = 'A2:B7';

        const full_url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=${SHEET_RANGE}`;

        const response = await fetch(full_url);
        const data = await response.text();

        res.send(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
