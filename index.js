const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const port = 8000;
const db = require("./config/ mongoose").db;
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require("connect-mongo")(session);
const sassMiddleware = require("node-sass-middleware");

const app = express();

app.use(
    sassMiddleware({
        src: "./assets/scss",
        dest: "./assets/css",
        debug: false,
        prefix: "/css",
        outputStyle: "expanded"
    })
);
app.use(express.urlencoded());
app.use(cookieParser());
app.use(expressLayouts);
app.use(express.static("./assets"));

app.use(
    session({
        name: "codeial",
        secret: "YOUR-SECRET-KEY", // TODO change in production mode
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 100
        },
        store: new MongoStore({
                mongooseConnection: db,
                autoRemove: "disabled"
            },
            function(err) {
                if (err) {
                    console.log(err || "err connecting to mongo store");
                }
            }
        )
    })
);

app.use(passport.initialize()); // run serializeUser()
app.use(passport.session()); // runs deserializeUser() on every request

/**
 * cookie value received along with the request is then searched through the database(mongodb) to populate the req.user object
 **/

app.use(passport.setAuthenticatedUser);

app.use("/", require("./routes/index"));

app.set("view engine", "ejs");
app.set("views", "./views");
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.listen(port, function(err) {
    if (err) console.log(`Error running the server: ${err}`);
    console.log(`Server is running on port ${port}`);
});


// name of mongoose model
// locals.user and user diff
// sass flow