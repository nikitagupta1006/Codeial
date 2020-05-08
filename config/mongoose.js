const mongoose = require("mongoose");
const env = require('./environment');

console.log(env);

mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`, {
    useNewUrlParser: true
});

var db = mongoose.connection;

db.on("error", function() {
    console.error.bind("console", "Error connecting to MongoDB");
});

db.on("connected", function() {
    console.log("MongoDB server is up and running");
});

module.exports.db = db;