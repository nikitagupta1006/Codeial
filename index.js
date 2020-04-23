const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require('cookie-parser');
const port = 8000;
const db = require('./config/ mongoose');

const app = express();

// middlewares -- executed every time a request hits the server
app.use(express.static('./assets')); // 3
app.use(expressLayouts); // 4

app.use(cookieParser()); // 2
app.use(express.urlencoded()); // 1

app.use("/", require("./routes/index")); // 5

app.set("view engine", "ejs");
app.set("views", "./views");
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


app.listen(port, function(err) {
    if (err) console.log(`Error running the server: ${err}`);
    console.log(`Server is running on port ${port}`);
});