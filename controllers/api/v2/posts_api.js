module.exports.index = function(req, res) {
    return res.json(200, {
        data: {
            posts: [{}],
            message: "List of posts in v2"
        }
    });
}