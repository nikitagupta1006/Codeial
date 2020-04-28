const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req, res) {

    Post.findById(req.body.post, function(err, post) {
        if (err) {
            console.log(`Error finding post corresponding to the comment: ${err}`);
            return;
        }

        if (!post) {
            // no post found
            console.log(`No post corresponding to the comment: ${err}`);
            return;
        }

        Comment.create({
            content: req.body.content,
            post: req.body.post,
            user: req.user._id
        }, function(err, newComment) {
            if (err) {
                console.log(`Error in adding comment: ${err}`);
                return;
            }

            post.comments.push(newComment);
            post.save();
            return res.redirect('back');
        });
    });
}


module.exports.destroy = function(req, res) {

    Comment.findById(req.params.id, function(err, comment) {
        if (err) {
            // complete
            console.log(`Error fetching comment from the database ${err}`);
            return;
        }

        if (!comment) {
            // no entry found in the database
            console.log('This comment does not exist in the database');
            return;
        }
        // comment.post => post id on which the comment is done
        // check if the author of the comment is the person who is signed in 
        // the author of the post should be able to delete the comment
        Post.findById(comment.post, function(err, post) {
            if (err) {
                console.log(`Error fetching post from the database ${err}`);
                return;
            }

            if (req.user.id == comment.user || req.user.id == post.user) {
                comment.remove();
                // let index = post.comments.indexOf(comment.id);
                // console.log("index", index);
                // post.comments.slice(index, 1);
                // post.save();
                post.comments.pull({
                    _id: comment._id
                });
                console.log(post.comments);
                return res.redirect('back');
            } else {
                // the signed in user in neither the author of the post nor the comment
                return res.redirect('back');
            }
        })



    });
}