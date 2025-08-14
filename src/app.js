const express = require('express');

const app = express();


app.use('/test/:id/:words', (request, response) => {
    //console.log(request.query);
    console.log(request.params);
    response.send('<h1>Hello from the server test!</h1>');
});

app.get('/test', (req, res) => {
    res.send('get request');
});

app.get('/user', (req, res, next) => {
    next();
    console.log('1st send');
    res.send('get request');
}, (req, res) => {
    console.log('2nd send');
    res.send('get 2nd request');
})

app.use('/', (request, response) => {
    response.send('<h1>Hello from the server!</h1>');
});

app.listen(3000, () => {
    console.log('hi');
});