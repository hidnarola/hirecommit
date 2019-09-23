var jwt = require('jsonwebtoken');
var config = require('../config');
module.exports = function (req, res, next) {
    // // console.log("\n=================================================================");
    // // console.log("Request Headers", req.headers);
    // // console.log("-----------------------------------------------------------------");
    // // console.log("Request Body", req.body);
    // // console.log("-----------------------------------------------------------------");
    console.log(req.headers['authorization'])
    // req.headers['x-access-token'];
    var token = req.body.token || req.query.token || req.headers['authorization'];
    console.log('token',token);
    if (token) {
        jwt.verify(token, config.ACCESS_TOKEN_SECRET_KEY, function (err, decoded) {
            if (err) {
                return res.status(config.UNAUTHORIZED).json({ message: err.message });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(config.UNAUTHORIZED).json({
            message: 'Unauthorized access'
        });
    }
}