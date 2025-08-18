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

// get user by email
app.get('/user', async (req, res) => {
    const userEmail = req.body.email;

    try {
        // const user = await User.find({emailId: userEmail}).exec();
        // if(user.length <= 0) {
        //     res.status(404).send('No user found');
        // } else {
        //     res.send(user);
        // }
        const user = await User.findOne({emailId: userEmail});
        if(!user) {
            res.status(404).send('No user found');
        } else {
            res.send(user);
        }
    } catch(e) {
        res.status(400).send('Something went wrong.');
    }
});

// get all the user
app.get('/feed', async (req, res) => {
    const users = await User.find({});
    res.send(users);
});

// delete user
app.delete('/user', async (req,res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        //const user = await User.findById(req.body._id);
        //await user.deleteOne();
        res.send('User deleted successfully');
    } catch(e) {
        res.status(400).send(e.message);
    }
});

// update a user
app.patch('/user', async (req, res) => {
    const userData = req.body;
    try {
        const user = await User.findOneAndUpdate({emailId: userData.emailId}, userData, {returnDocument: 'after'});
        if(!user) {
            res.status(404).send('No user found');
        } else {
            res.send(user);
        }
    } catch(e) {
        res.status(400).send(e.message);
    }
});

app.get('/', (req, res) => {
    res.send('this is it!');
})

app.listen(3000, () => {
    console.log('hiii');
});