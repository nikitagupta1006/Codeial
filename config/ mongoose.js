const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/user_db', {
    useNewUrlParser: true
});

var db = mongoose.connection;

db.on('error', function() {
    console.error.bind('console', "Error connecting to MongoDB");
});

db.on('connected', function() {
    console.log("MongoDB server is up and running");
});

module.exports.db = db;