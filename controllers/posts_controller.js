const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports.create = async function(req, res) {
    console.log(req.body);
    try {
        let newPost = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        console.log(newPost);
        if (req.xhr) {
            await Post.populate(newPost, {
                path: 'user'
            });
            console.log("server side");
            console.log(newPost);
            return res.status(200).send({
                data: {
                    post: newPost,
                    message: "Post created!"
                }
            });
        }
        req.flash('info', 'Post added successfully');
        return res.redirect('back');
    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }
}

// The form for posting a new post should be visible only to the signed in users
// display the newsfeed to the user
module.exports.home = async function(req, res) {

    try {
        let posts = await Post.find({})
            .sort('-createdAt')
            .populate({
                path: 'user'
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            });
        let users = await User.find({});
        return res.render('home', {
            title: 'Codeial | Posts',
            posts: posts,
            all_users: users
        });
    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }

}

module.exports.destroy = async function(req, res) {

    try {
        let post = await Post.findById(req.params.id);
        if (!post)
            throw new Error('Post not found in the database');

        if (post.user == req.user.id) {
            post.remove();
            Comment.deleteMany({
                post: req.params.id
            });
            if (req.xhr) {
                return res.status(200).send({
                    data: {
                        post: post,
                        message: "Post deleted successfully"
                    }
                });
            }
            req.flash('info', 'Post deleted successfully');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }
}