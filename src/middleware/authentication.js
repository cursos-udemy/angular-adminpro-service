const jwt = require('jsonwebtoken');

const config = require('../config/config');
const userRepository = require('../repositories/user.repository');

//middleware: validate token

module.exports.validateToken = function (req, res, next) {
    //read token from headers or body or queryparams
    //const token = req.headers['access-token'] || req.body['token'] || req.query['token'];
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'token is required' });
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json('Invalid token');

    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        const user = userRepository.findById(decoded.id)
            .then(u => {
                if (!u) return res.status(401).json({ message: 'Corrupt token' });
                req.user = u;
                next();
            }).catch(err => res.status(401).json({ message: 'Corrupt token' }))
    });
}
