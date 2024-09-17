// nseIndiaMain.js
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws'); // Add WebSocket support
const dotenv = require('dotenv');
const { startServer } = require('./serverLogic'); // Externalize startServer logic

dotenv.config();
const port = 6000;
const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// WebSocket setup
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        if (message === 'startServer') {
            startServer(); // Trigger the function
            ws.send('Server started!');
        }
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});
