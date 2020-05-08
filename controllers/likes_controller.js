const Post = require('../models/post');
const Like = require('../models/like');
const Comment = require('../models/comment');

module.exports.toggleLike = async function(req, res) {
    // post request - sent
    try {
        console.log(req.body);
        let likeable; // parent on which like is to be placed/ removed
        let deleted = false;

        // get the parent element
        if (req.body.type == 'Post') {
            likeable = await Post.findById(req.body.id);
        } else {
            likeable = await Comment.findById(req.body.id);
        }

        // find if that object is already liked 
        let like = await Like.findOne({
            onModel: req.body.type,
            likeable: likeable._id
        });

        // if like found => then delete the like
        if (like) {
            console.log("like already exists");
            likeable.likes.pull(like._id);
            likeable.save();
            like.remove();

            deleted = true;
        } else {
            // add the like to the likes collection and push to the likes array of the likeable object

            let newLike = await Like.create({
                user: req.user,
                likeable: req.body.id,
                onModel: req.body.type
            });
            console.log(newLike);
            console.log("new like created");
            likeable.likes.push(newLike._id);
            likeable.save();

        }

        return res.json(200, {
            data: {
                deleted: deleted
            },
            message: "Request sucessful"
        });

    } catch (err) {
        console.log(`Error in toggle like ${err}`);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }

}


module.exports.getLikes = async function(req, res) {

    try {
        let likeable = req.query.type;
        switch (likeable) {
            case 'Post':
                {
                    let post = await Post.findById(req.query.id);
                    let numLikes = post.likes.length;
                    return res.status(200).json({
                        data: {
                            likes: numLikes,
                            message: `Likes on post-${req.query.id}`
                        }
                    });
                }

            case 'Comment':
                {
                    let comment = await Comment.findById(req.query.id);
                    let numLikes = comment.likes.length;
                    return res.status(200).json({
                        data: {
                            likes: numLikes,
                            message: `Likes on comment-${req.query.id}`
                        }
                    });
                }
        }
    } catch (err) {
        console.log(`Error fetching likes ${err}`);
        return;
    }
}