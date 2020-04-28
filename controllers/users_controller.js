const User = require("../models/user");

module.exports.profile = function(req, res) {
    console.log("id received: ", req.params.id);
    User.findById(req.params.id, function(err, user) {
        if (err) {
            console.log(`Error fetching user from database ${err}`);
            return;
        }
        return res.render("user_profile", {
            title: "Profile Page",
            profile_user: user
        });
    });
};

module.exports.signIn = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/users/profile");
    }
    return res.render("user_sign_in", {
        title: "Codeial | Sign In",
        profile_user: req.user._id
    });
};

module.exports.signUp = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/users/profile");
    }
    return res.render("user_sign_up", {
        title: "Codeial | Sign Up"
    });
};

module.exports.create = function(req, res) {
    if (req.body.password != req.body.confirm_password) {
        console.log("passwords donot match");
        return res.redirect("/users/sign-up");
    }

    User.findOne({
            email: req.body.email
        },
        function(err, user) {
            if (err) {
                console.log("Error while fetching the user from the database", err);
                return; // hang in there
            }
            if (user) {
                // user with the email exists
                console.log("user already exists");
                return res.redirect("/users/sign-up");
            }
            User.create(req.body, function(err, user) {
                if (err) {
                    console.log("Error creating user while signing up", err);
                    return;
                }
                // redirect the user to sign in page
                return res.redirect("/users/sign-in");
            });
        }
    );
};

module.exports.createSession = function(req, res) {
    // user is signed in
    console.log("reached the action controller");
    return res.redirect("/users/profile");
};

module.exports.destroySession = function(req, res) {
    // destroy the session
    req.logout();
    return res.redirect("/");
};

module.exports.edit = function(req, res) {
    console.log(req.params.id);
    if (req.params.id == req.user.id) {
        User.findByIdAndUpdate(
            req.params.id, {
                name: req.body.name,
                email: req.body.email
            },
            function(err, user) {
                if (err) {
                    console.log(`${err}`);
                    return;
                }
                console.log("Updated user: ");
                console.log(user);
                return res.redirect("back");
            }
        );
    } else {
        res.status(401).send('Unauthorized');
    }
}