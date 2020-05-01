const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res) {
    console.log(req.headers);
    try {

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
        console.log(`Error: ${err}`);
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