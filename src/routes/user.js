const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionReuqestModel = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");

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

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionReuqestModel.find({
            $or: [{fromUserId: loggedInUser}, {toUserId: loggedInUser}]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId);
            hideUsersFromFeed.add(req.toUserId);
        });

        const users = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.send({message: "Data fetched successfully", data: users});
    } catch (error) {
        res.status(400).send("Error - " + error.message);
    }
})

module.exports = userRouter;