const User = require('../models/user');

module.exports.signIn = function(req, res) {
    return res.render('user_sign_in', {
        title: 'Codeial | Sign In'
    });
}

module.exports.signUp = function(req, res) {
    return res.render('user_sign_up', {
        title: 'Codeial | Sign Up'
    });
}

module.exports.create = function(req, res) {

    if (req.body.password != req.body.confirm_password) {
        console.log('passwords donot match');
        return res.redirect('/users/sign-up');
    }

    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) {
            console.log('Error while fetching the user from the database', err);
            return; // hang in there
        }
        if (user) {
            // user with the email exists
            console.log('user already exists');
            return res.redirect('/users/sign-up');
        }
        User.create(req.body, function(err, user) {
            if (err) {
                console.log('Error creating user while signing up', err);
                return;
            }
            // redirect the user to sign in page
            return res.redirect('/users/sign-in');
        })
    });
}


module.exports.createSession = function(req, res) {
    // TO DO logic for creation
}