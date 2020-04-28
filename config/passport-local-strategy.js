const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

passport.use(
    new LocalStrategy({
            usernameField: 'email'
        },
        function(email, password, done) {
            User.findOne({
                email: email
            }, function(err, user) {
                if (err) {
                    console.log("Error fetching user from the database --> Passport");
                    return done(err);
                }

                if (!user || password != user.password) {
                    console.log("Invalid username/ password");
                    return done(null, false);
                }

                return done(null, user);
            });
        }
    ));

// serialize the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// deserialize the user from the key in the cookies
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        if (err) {
            console.log("Error fetching user from database");
            done(err);
        }
        done(null, user);
    });
});

passport.checkAuthentication = function(req, res, next) {
    // user is signed in -> pass the request to the next function -- i.e the controller's action
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        // req.user contains the current signed in user 
        res.locals.user = req.user

    }
    return next();
}

// passport.isNotLoggedIn = function(req, res, next) {
//     console.log("is not logged in called");
//     if (!req.isAuthenticated()) {
//         return next();
//     }
//     return res.redirect('/');
// }

module.exports = passport;