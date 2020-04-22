const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require('cookie-parser');
const port = 8000;
const db = require('./config/ mongoose');

const app = express();

app.use(express.urlencoded());
app.use(cookieParser());
app.use(expressLayouts); // needs to be done before specifying the router
app.use(express.static('./assets'));
app.use("/", require("./routes/index"));

app.set("view engine", "ejs");
app.set("views", "./views");
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


app.listen(port, function(err) {
    if (err) console.log(`Error running the server: ${err}`);
    console.log(`Server is running on port ${port}`);
});