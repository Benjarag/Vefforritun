const express = require('express');
const app = express();

const hostname = '127.0.0.1';
const port = 3000;

app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});

app.post('/test', (req, res) => {
    res.status(200).send('Test post!');
});

app.listen(port, hostname, () => {
    console.log('Express app listening on port ' + port);
});