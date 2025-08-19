const validator = require("validator");

const validateSignupData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName) {
        throw new Error("Name is not valid");
    }

    if(firstName.length < 4 || firstName.length > 50) {
        throw new Error("Firstname should be 4 to 50 characters.");
    } else if(lastName.length < 4 || lastName.length > 50) {
        throw new Error("LastName should be 4 to 50 characters.");
    } else if(!validator.isEmail(emailId)) {
        throw new Error("Invalid Email");
    } else if(!validator.isStrongPassword(password)) {
        throw new Error('Please enter a strong password.');
    }
}

module.exports = {
    validateSignupData
}