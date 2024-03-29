const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue'); // obtained from createQueue()
const commentEmailWorker = require('../workers/comment_email_worker');
// defined the task supposed to be performed by different workers assigned to the queue

module.exports.create = async function(req, res) {
    try {
        console.log(req.body);
        let post = await Post.findById(req.body.post);
        if (!post) {
            console.log(`No post corresponding to the comment: ${err}`);
            return;
        }

        let newComment = await Comment.create({
            content: req.body.content,
            post: req.body.post,
            user: req.user._id
        });
        post.comments.push(newComment);
        await post.save();
        await Comment.populate(newComment, {
            path: 'user'
        });

        let job = queue.create('emails', {
            comment: newComment
        });

        job.save((err) => {
            if (err) {
                console.log(`Error in saving comment email job to redis database ${err}`);
                return;
            }
            console.log("comment email job enqueued: ", job.id);
        });

        // this will fire the request immediately to send the request to the concerned person
        // commentsMailer.newComment(newComment);

        // this way of adding flash displays the message on the next request which is not what we want, since we are not refreshing the page.
        // this should be displayed as soon as the message is posted

        if (req.xhr) {
            return res.status(200).send({
                data: {
                    comment: newComment,
                    message: "Comment added successfully"
                }
            });
        }
        req.flash('info', 'Comment added successfully');
        return res.redirect('back');

    } catch (err) {
        console.log(`Error in adding the comment to the database: ${err}`);
    }
};



module.exports.destroy = async function(req, res) {

    try {
        let comment = await Comment.findById(req.params.id);
        if (!comment) {
            throw new Error('This comment does not exist in the database');
        }
        // comment.post => post id on which the comment is done
        // check if the author of the comment is the person who is signed in 
        // the author of the post should be able to delete the comment
        let post = await Post.findById(comment.post);

        if (req.user.id == comment.user || req.user.id == post.user) {
            comment.remove();
            post.comments.pull({
                _id: comment._id
            });
            await Like.deleteMany({
                onModel: 'Comment',
                likeable: req.params.id
            });
            // sending the mail after the comment has been deleted
            await Comment.populate(comment, {
                path: 'user'
            });
            commentsMailer.deleteComment(comment);
            if (req.xhr) {
                return res.status(200).send({
                    data: {
                        comment: comment,
                        message: "Comment deleted successfully"
                    }
                });
            }
            req.flash('info', 'Comment deleted successfully');
            return res.redirect('back');
        } else {
            // the signed in user is neither the author of the post nor the comment
            req.flash('info', 'Comment could not be deleted');
            return res.redirect('back');
        }
    } catch (err) {
        console.log(`Error: ${err}`);
    }
}