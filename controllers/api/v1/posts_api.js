const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res) {

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

        return res.json(200, {
            data: {
                posts: posts,
                message: "List of posts in v1"
            }
        });
    } catch (err) {
        return res.json(500, {
            mesage: "Internal Server Error"
        });
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

            return res.json(200, {
                message: "Post and associated comments have been deleted"
            });
        } else {
            return res.json(401, {
                message: "You are not authorized to delete the post"
            });
        }

    } catch (err) {
        console.log(err);
        return res.json(500, {
            message: "Internal Server Error"
        })
    }
}