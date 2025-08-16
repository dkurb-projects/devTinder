const express = require('express');
require("./config/database");

const app = express();
const User = require("./models/user");

app.use(express.json());

app.post('/signup', async (req, res) => {
    console.log(req.body);
    const userObj = req.body;
    const user = new User(userObj);

    try {
        await user.save();
        res.send('User added successfully.')
    } catch(e) {
        res.status(400).send('Error saving user - ' + e.message);
    }
});

app.get('/', (req, res) => {
    res.send('this is it!');
})

app.listen(3000, () => {
    console.log('hi');
});