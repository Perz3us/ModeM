const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3010;

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox']
    }
});

let isReady = false;

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
    isReady = true;
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.initialize();

app.get('/', (req, res) => {
    res.send('WhatsApp Service is running');
});

app.post('/send-message', async (req, res) => {
    console.log('Received request to send message:', req.body);
    if (!isReady) {
        console.log('Client not ready');
        return res.status(503).json({ success: false, message: 'WhatsApp client is not ready yet.' });
    }

    const { mobileNumber, message } = req.body;

    if (!mobileNumber || !message) {
        console.log('Missing params');
        return res.status(400).json({ success: false, message: 'Missing mobileNumber or message.' });
    }

    try {
        // Format mobile number: remove '+' and append '@c.us'
        const chatId = mobileNumber.replace(/\D/g, '') + '@c.us';
        
        console.log(`Sending message to ${chatId}: ${message}`);
        const response = await client.sendMessage(chatId, message);
        console.log('Message sent successfully to', chatId);
        res.json({ success: true, response });
    } catch (error) {
        console.error('Failed to send message', error);
        res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`WhatsApp service listening at http://localhost:${port}`);
});
