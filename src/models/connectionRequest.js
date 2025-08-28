const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        },
        required: true
    }
}, {
    timestamps: true
});

connectionRequestSchema.pre("save", function (next) {
    const conRequest = this;

    if(conRequest.fromUserId.equals(conRequest.toUserId)) {
        throw new Error("Can't send connection request to yourself.");
    }
    next();
})

const ConnectionReuqestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionReuqestModel;