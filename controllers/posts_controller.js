const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports.create = function(req, res) {

    Post.create({
        content: req.body.content,
        user: req.user._id
    }, function(err, newPost) {
        if (err) {
            console.log(`Error creating a new post: ${err}`);
            return; // hang in there
        }
        console.log(newPost);
        return res.redirect('back');
    });

}

module.exports.home = function(req, res) {
    // if (!req.isAuthenticated()) {
    //     return res.redirect('/users/sign-in');
    // }  --> Any person whether signed in or not should be able to access the posts

    // The form for posting a new post should be visible only to the signed in users

    Post.find({})
        .populate({
            path: 'user'
        })
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })
        .exec(function(err, posts) {
            if (err) {
                console.log(`Error fetching users from the database ${err}`);
                return;
            }
            User.find({}, function(err, users) {
                return res.render('home', {
                    title: 'Codeial | Posts',
                    posts: posts,
                    all_users: users
                });
            })

        });

}


module.exports.destroy = function(req, res) {
    // check if the post exists in the database 
    Post.findById(req.params.id, function(err, post) {
        if (err) {
            console.log(`Error fetching the post from the database: ${err}`);
            return;
        }
        if (!post) {
            console.log(`No post found with the post id: ${req.params.id}`);
            return;
        }

        // delete the post along with the comments associated
        // check if the user is authorized to delete the post
        if (post.user == req.user.id) {
            // delete the post  
            post.remove();
            Comment.deleteMany({
                post: req.params.id
            }, function(err) {
                if (err) {
                    console.log(`Error deleting the post from the database: ${err}`);
                    return;
                }
                return res.redirect('back');
            });

        } else {
            return res.redirect('back');
        }

    })
}