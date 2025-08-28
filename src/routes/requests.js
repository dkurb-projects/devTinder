const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");

const requestsRouter = express.Router();

requestsRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // check if allowed status
        const allowedStatus = ['ignored', 'interested'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: 'Not allowed' });
        }

        // check if toUser exists in DB
        const toUser = await User.findById(toUserId);
        if(!toUser) {
            return res.status(404).json({message: 'User not found'});
        }

        // check if already sent request
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [{
                fromUserId,
                toUserId
            }, {
                fromUserId :toUserId,
                toUserId: fromUserId
            }],
        });
        if (existingConnectionRequest) {
            return res.status(400).json({ message: 'Already sent request' });
        }

        // save request
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        res.json({
            message: `${req.user.firstName} has ${status} ${toUser.firstName}'s request`,
            data
        })

    } catch (error) {
        res.status(400).send("Error - " + error.message);
    }
    res.send("Connection sent");
});

module.exports = requestsRouter;