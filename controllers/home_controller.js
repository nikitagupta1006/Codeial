/** 
 * controllers are supposed to have actions defined for every route
 */

module.exports.home = function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    })
    return res.end('<h1>Hello from / </h1>');
};

module.exports.create = function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    })
    return res.end('<h1>Hello from /create </h1>');
};

module.exports.insert = function(req, res) {
    console.log(req.body); // post request
    return res.json(req.body);
}