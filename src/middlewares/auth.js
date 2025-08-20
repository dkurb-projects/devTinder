const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, resp, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            throw new Error('Invalid token');
        }

         const decodedToken = await jwt.verify(token, "DEV@TINDER$11");
        
         const {_id} = decodedToken;
        
         const user = await User.findById(_id);
        
        if(!user) {
            throw new Error("User not found");
        }
        
        req.user = user;
        //req.user = {id: 1234};
        next();
    } catch(e) {
        throw new Error('error - ' + e.message);
    }
};

module.exports = {
    userAuth
}