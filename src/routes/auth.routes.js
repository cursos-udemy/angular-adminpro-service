const express = require('express');

const config = require('../config/config');

const auth = require('../middleware/authentication');
const { login, loginGoogle, logout, refreshToken } = require('../controllers/auth.controller');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/request-validators')


const router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.post('/login',
    [
        body('email', 'email is required').notEmpty(),
        body('email', 'email is invalid').isEmail(),
        body('password', 'password is required').notEmpty(),
        validateRequest
    ],
    login);

router.post('/login/google',
    [
        body('token', 'token google is required').notEmpty(),
        validateRequest
    ],
    loginGoogle);

router.post('/logout',
    [
        auth.validateToken,
    ],
    logout);

router.post('/refreshToken',
    [
        body('token', 'token is required').notEmpty(),
        auth.validateToken,
    ],
    refreshToken);

module.exports = router
