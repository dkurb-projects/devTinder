const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionReuqestModel = require("../models/connectionRequest");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName skills photoUrl age about gender";

// get all pending connection requests
userRouter.get("/user/requests", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionReuqestModel.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate("fromUserId", USER_SAFE_DATA);

        if(connectionRequests.length <= 0) {
            return res.status(404).json({message: "No requests found!"});
        }

        return res.send({message: "Requests", data: connectionRequests});
    } catch (error) {
        res.status(400).send("Error - " + error.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionReuqestModel.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id,}
            ],
            status: 'accepted'
        }).populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = connections.map((connection) => connection.fromUserId._id.equals(loggedInUser._id) ? connection.toUserId : connection.fromUserId);

        res.send({message: 'Connections fetched successfully', data});
    } catch (error) {
        res.status(400).send("Error - " + error.message);
    }
});

module.exports = userRouter;