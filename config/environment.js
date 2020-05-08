const fs = require("fs");
const path = require("path");
const rfs = require("rotating-file-stream");

// directory where the logs will exist
const logDirectory = path.join(__dirname, "..", "productionLogs");
// check if the acces log directory exists, else create the directory
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// access logs, since the users shall be accesing the website
// name of the log files - access.log
const accessLogStream = rfs.createStream("access.log", {
    interval: "1d",
    path: logDirectory,
});

const development = {
    name: "development",
    db: "user_db",
    smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "nikidps@gmail.com",
            pass: "NikitaGupta4@",
        },
    },
    google_client_id: "774505300296-7pkqbde8r75vpsv3drndpatjis08a6st.apps.googleusercontent.com",
    google_client_secret: "vHcaQlEkdZiguzxuctQsQVRh",
    google_callback_URL: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: "codeial",
    asset_path: "./assets",
    session_cookie_key: "codeial",
    morgan: {
        mode: "dev",
        options: {
            stream: accessLogStream
        },
    },
};

const production = {
    name: "production",
    db: "user_db",
    smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODEIAL_AUTH_USER,
            pass: process.env.CODEIAL_AUTH_PASS,
        },
    },
    google_client_id: "774505300296-7pkqbde8r75vpsv3drndpatjis08a6st.apps.googleusercontent.com",
    google_client_secret: "vHcaQlEkdZiguzxuctQsQVRh",
    google_callback_URL: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    morgan: {
        mode: "combined",
        options: {
            stream: accessLogStream
        },
    },
};


module.exports =
    eval(process.env.NODE_ENV) == undefined ?
    development :
    eval(process.env.NODE_ENV);