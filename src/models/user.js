const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error('Please enter strong password');
            }
        }
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
        default: "https://toppng.com//public/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error('Invalid Photo URL');
            }
        }
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

userSchema.methods.getJWT = async function () {
    const token = await jwt.sign({ _id: this._id }, "DEV@TINDER$11", {expiresIn: '7d'});
    return token;
}

userSchema.methods.validatePassword = async function(password) {
    const isPasswordValid = await bcrypt.compare(password, this.password);
    return isPasswordValid;
}

const userModel = mongoose.model('UserModel', userSchema);

module.exports = userModel;