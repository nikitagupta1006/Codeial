const User = require("../models/user");
const path = require('path');
const fs = require('fs');
// using promises 
// mongoose queries are thenables not promises
// they return promises with exec
// with await, use exec for better stack traces

// view user profile
module.exports.profile = function(req, res) {

    let isUserFound = User.findById(req.params.id).exec();
    isUserFound.then((user) => {
        return res.render("user_profile", {
            title: "Profile Page",
            profile_user: user
        });
    }).catch(err => {
        console.log(`Error ${err}`);
        return;
    });

}

// sign in
module.exports.signIn = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/users/profile/${req.user._id}");
    }
    return res.render("user_sign_in", {
        title: "Codeial | Sign In",
    });
};

// sign up
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

    let isUserFound = User.findOne({
        email: req.body.email
    }).exec();

    isUserFound.then((user) => {
        if (user) { // user with the email exists
            console.log("user already exists");
            return res.redirect("/users/sign-up");
        }

        let newUser = User.create(req.body).exec();
        return res.redirect("/users/sign-in");

    }).catch((err) => {
        console.log(`Error ${err}`);
        return;
    });

}

module.exports.createSession = function(req, res) {
    // user is signed in
    req.flash('success', 'Signed in successfully');
    return res.redirect(`/users/profile/${req.user.id}`);
};

module.exports.destroySession = function(req, res) {
    // destroy the session
    req.logout();
    console.log("session: ", req.session);
    req.flash('success', 'Signed out successfully');
    return res.redirect("/posts");
};

module.exports.edit = async function(req, res) {

    if (req.params.id == req.user.id) {
        try {
            let user = await User.findById(req.user.id);
            User.uploadedAvatar(req, res, function(err) {
                if (err) {
                    console.log("MULTER ERROR: ", err);
                }
                // being handled after the file has been stored in the directory
                console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;
                if (req.file) {
                    if (user.avatar) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    // not compulsory to upload files
                    user.avatar = path.join(User.avatarPath, req.file.filename);
                }
                user.save();
                return res.redirect('back');
            });
        } catch (err) {
            console.log(err);
            req.flash('error', err);
            return res.redirect('back');
        }
    } else {
        return res.status(401).send('Unauthorized');
    }

}