const express = require("express");
const {userAuth} = require("../middlewares/auth.js");
const { validateProfileEditData } = require("../utils/validation.js");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
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

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
    try {
        if(!validateProfileEditData(req)) {
            throw new Error('Invalid edit request');
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);

        await loggedInUser.save();
        res.send("Profile updated successfully.");
    }catch(e) {
        res.status(400).send("error - " + e.message);
    }
});

module.exports = profileRouter;