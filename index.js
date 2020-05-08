const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("./config/environment");

const logger = require("morgan");
const cookieParser = require("cookie-parser");
const port = process.env.CODEIAL_PORT || 8000;
const db = require("./config/mongoose").db;
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const MongoStore = require("connect-mongo")(session);
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMware = require("./config/middleware");
const path = require("path");

const app = express();

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(function(req, res, next) {
    app.locals.appName = "CODEIAL";
    res.locals.appName = "codeial";
    next();
});

// sassMiddleware should run only if in development mode
if (env.name == "development") {
    app.use(
        sassMiddleware({
            src: path.join(env.asset_path, "scss"),
            dest: path.join(env.asset_path, "css"),
            debug: false,
            prefix: "/css",
            outputStyle: "expanded",
        })
    );
}
app.use(express.urlencoded());
app.use(cookieParser());
app.use(expressLayouts);
// make the uploads path available to the browser
app.use("/uploads", express.static("./uploads"));
app.use(express.static(env.asset_path));

app.use(
    session({
        name: "codeial",
        secret: env.session_cookie_key, // TODO change in production mode
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 100,
        },
        store: new MongoStore({
                mongooseConnection: db,
                autoRemove: "disabled",
            },
            function(err) {
                if (err) {
                    console.log(err || "err connecting to mongo store");
                }
            }
        ),
    })
);

app.use(passport.initialize()); // run serializeUser()
app.use(passport.session()); // runs deserializeUser() on every request

// #region
/**
 * cookie value received along with the request is then searched through the database(mongodb) to populate the req.user object
 **/
// #endregion

app.use(passport.setAuthenticatedUser);

// set after the passport.session() has been called
app.use(flash());
app.use(customMware.setFlash);

app.use("/", require("./routes/index"));

app.set("view engine", "ejs");
app.set("views", "./views");
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.listen(port, function(err) {
    if (err) console.log(`Error running the server: ${err}`);
    console.log(`Server is running on port ${port}`);
});

// chatting engine
// friendships and likes
// bash_profile
// gulp - minification and renaming of files to prevent browser caching