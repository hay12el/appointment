const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('auth-token')
    if(!token) return res.status(401).send('Access denied');

    // verify the token
    try {
        const verified = jwt.verify(token, process.env.S)
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid token')
    }
}