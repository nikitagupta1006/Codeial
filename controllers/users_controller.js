const User = require('../models/user');

// in asynchronous execution, if the you have 2 code snippets - 1. callback function 2. code after the DB operation, the code written outside the callback will be executed first, and then the callback

module.exports.profile = function(req, res) {
    if (req.cookies['user_id'] == undefined) {
        return res.redirect('/users/sign-in');
    }
    User.findById(req.cookies.user_id, function(err, user) {
        console.log('callback executed');
        if (err) {
            console.log(`Error fetching user from the database: ${err}`);
            return;
        }
        if (user) {
            return res.render('profile', {
                title: 'Codeil | Profile Page',
                email: user.email,
                name: user.name
            });
        } else {
            // in case the user is not found - when the user_id is changed
            return res.redirect('/users/sign-in');
        }
    });

}

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

    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) {
            console.log(`Error fetching user for authentication: ${err}`);
            return; // hang in there
        }
        // found the user
        // check password
        if (user.password != req.body.password) {
            // passwords donot match
            return res.redirect('back');
        }
        // passwords match 
        // set the cookie in response and send back to the browser
        res.cookie('user_id', user.id);
        return res.redirect('/users/profile');

    });

}

module.exports.signOut = function(req, res) {
    res.clearCookie('user_id');
    res.redirect('/users/sign-in');
}