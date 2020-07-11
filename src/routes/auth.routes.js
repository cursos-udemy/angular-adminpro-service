const express = require('express');
const mongooseBcrypt = require('mongoose-bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');

const UserModel = require('../models/user.model');
const config = require('../config/config');
const handleError = require('../utils/error-util');
const userRepository = require('../repositories/user.repository');

const router = express.Router();
const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    userRepository.authenticate(email, password)
        .then(user => res.json(generateAuthenticateResponse(user)))
        .catch(err => res.status(403).json({ message: 'invalid credentials' }));
});

router.post('/login/google', (req, res) => {
    const { token } = req.body;
    verify(token)
        .then(googleUser => userRepository.checkGoogleAccount(googleUser))
        .then(user => res.json(generateAuthenticateResponse(user)))
        .catch(err => res.status(403).json({ message: 'invalid token', err }));
});

router.post('/logout', (req, res) => {
    res.json('ok');
});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
}

function generateToken(user) {
    const payload = { id: user._id, email: user.email, name: user.name, roles: [user.role] };
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRE_IN });
}

function generateAuthenticateResponse(userAuthenticated) {
    return { accessToken: generateToken(userAuthenticated), user: userAuthenticated }
}

module.exports = router
