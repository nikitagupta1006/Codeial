const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

passport.use(new googleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_callback_URL,
}, function(accessToken, refreshToken, profile, done) {
    User.findOne({
        email: profile.emails[0].value
    }).exec(function(err, user) {
        if (err) {
            console.log(`Error in google-oauth-strategy ${err}`);
            return done(err);
        }

        if (!user) {
            // create the user + set as req.user
            User.create({
                email: profile.emails[0].value,
                name: profile.displayName,
                password: crypto.randomBytes(20).toString('hex')
            }, function(err, user) {
                if (err) {
                    console.log(`Error in creating user ${err}`);
                    return done(err);
                }
                console.log(`User created: ${user}`);
                return done(null, user);
            });
        } else {
            // user found in the database + set as req.user - serializeUser() and then deserializeUser()
            return done(null, user);
        }
    })
}));

module.exports = passport;