const express = require('express');
const mongooseBcrypt = require('mongoose-bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user.model');
const config = require('../config/config');
const handleError = require('../utils/error-util');

const router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email })
        .then(user => {
            if (user) {
                if (user.verifyPasswordSync(password)) {
                    const payload = { email: user.email, name: user.name, roles: [user.role] };
                    const accessToken = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRE_IN });
                    res.json({accessToken });
                } else {
                    res.status(400);
                    res.json({message: 'invalid credentials' });
                }
            } else {
                res.status(404);
                res.json({message: 'invalid credentials' });
            }
        })
        .catch(err => handleError(res, err, 'error authentication user', 500));
})

module.exports = router
