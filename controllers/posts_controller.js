const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const Like = require('../models/like');
const queue = require('../config/kue');

const postEmaiWorker = require('../workers/post_email_worker');


module.exports.create = async function(req, res) {
    try {
        let newPost = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        await Post.populate(newPost, {
            path: 'user'
        });
        console.log(newPost);
        // add a send email to the user job to the queue
        let job = await queue.create('posts', {
            post: newPost
        });

        job.save(function(err) {
            if (err) {
                console.log(`Error in saving post email job to redis database ${err}`);
            }
            console.log("post email job enqueued: ", job.id);
        })


        if (req.xhr) {
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
            Comment.deleteMany({
                post: req.params.id
            });
            // delete all the likes associated
            await Like.deleteMany({
                onModel: 'Post',
                likeable: req.params.id
            });
            await Like.deleteMany({
                _id: {
                    $in: post.comments
                }
            });
            post.remove();

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