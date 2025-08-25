const express = require("express");
const {userAuth} = require("../middlewares/auth.js");

const requestsRouter = express.Router();

requestsRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    res.send("Connection sent");
});

module.exports = requestsRouter;