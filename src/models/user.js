const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if(!['Male', 'Female', 'Other'].includes(value)) {
                throw new Error("Invalid gender");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://toppng.com//public/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png"
    },
    about: {
        type: String,
        default: "This is default about me."
    },
    skills: {
        type:[String]
    }
}, {
    timestamps: true
});

const userModel = mongoose.model('UserModel', userSchema);

module.exports = userModel;