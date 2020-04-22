/** 
 * controllers are supposed to have actions defined for every route
 */

module.exports.home = function(req, res) {
    console.log(req.cookies);
    res.cookie('user_id', 200);
    res.cookie('new', 10);
    return res.render('home', {
        title: 'HOME'
    });
};

module.exports.create = function(req, res) {
    return res.render('home', {
        title: 'Create Page'
    });
};

module.exports.insert = function(req, res) {
    console.log(req.body); // post request
    return res.json(req.body);
}