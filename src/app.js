const express = require('express');

const app = express();


app.use('/test', (request, response) => {
    response.send('<h1>Hello from the server test!</h1>');
})

app.use('/', (request, response) => {
    response.send('<h1>Hello from the server!</h1>');
});

app.listen(3000, () => {
    console.log('hi');
});