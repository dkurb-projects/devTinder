const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://vagheladisha88:v3FI3so0epvof5pa@namastenode.fnrzqoo.mongodb.net/devTinder");
}

connectDB().then(() => {
    console.log('Database connection success');
}).catch((e) => {
    console.log(e);
    console.log('Database cannot be connected');
});