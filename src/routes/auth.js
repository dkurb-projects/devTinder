const express = require("express");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
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


authRouter.post('/login', async (req, res) => {
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

authRouter.post('/logout', userAuth, async(req, res) => {
    try {
        res.cookie('token', null);
        console.log('hiiiiii');
        res.send("Logout successful");
    } catch(e) {
        res.status(400).send("error - " + e.message);
    }
})
module.exports = authRouter;