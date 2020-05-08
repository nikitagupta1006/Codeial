const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const env = require('./environment');

let opts = {
    secretOrKey: env.jwt_secret, // to decrypt 
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};


passport.use(
    new JWTStrategy(opts, function(jwt_payload, done) {
        console.log(jwt_payload);
        User.findById(jwt_payload._id, function(err, user) {
            if (err) {
                console.log(`Error in JWT Authorization: ${err}`);
                return done(err);
            }

            if (!user) return done(null, false);
            return done(null, user);
        });
    })
);

module.exports = passport;