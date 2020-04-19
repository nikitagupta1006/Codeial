/** 
 * controllers are supposed to have actions defined for every route
 */

module.exports.profile = function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    return res.end('<h1>Hello from /user </h1>');
};