/** 
 * controllers are supposed to have actions defined for every route
 */

module.exports.base = function(req, res) {

    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    return res.end('<h2>/posts/</h2>');

}