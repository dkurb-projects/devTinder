const express = require("express");
const {userAuth} = require("../middlewares/auth.js");

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

module.exports = profileRouter;