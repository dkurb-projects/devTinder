const express = require('express');
require("./config/database");
const { validateSignupData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth.js");

const app = express();
const User = require("./models/user");

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
    try {
        // validate your data
        validateSignupData(req);

        const { firstName, lastName, emailId, password } = req.body;
        // Encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);

        const userObj = req.body;
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: encryptedPassword
        });
        await user.save();
        res.send('User added successfully.')
    } catch (e) {
        res.status(400).send('Error saving user - ' + e.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error('Invalid Credentials');
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            const token = await user.getJWT();
            console.log(token);

            res.cookie('token', token);
            res.send('User login successful');
        } else {
            throw new Error('Invalid Credentials');
        }

    } catch (e) {
        res.status(400).send('Error - ' + e.message);
    }
});

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        if(!user) {
            throw new Error("User does not exist");
        }
        res.send(user);
    } catch (e) {
        res.status(400).send('Error - ' + e.message);
    }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    res.send("Connection sent");
});

app.get('/', (req, res) => {
    res.send('this is it!');
})

app.listen(3000, () => {
    console.log('hiii');
});