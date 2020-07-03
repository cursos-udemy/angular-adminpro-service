const express = require('express');
const mongooseBcrypt = require('mongoose-bcrypt');
const UserModel = require('../models/user.model');


const router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    UserModel.findOne({ email })
        .then(user => {
            if (user) {
                var valid = user.verifyPasswordSync(password);
                if (valid) {
                    res.json('Valid (sync)');
                } else {
                    res.status(400);
                    res.json({ ok: false, message: 'username or password incorrect' });
                }    
            } else {
                res.status(404);
                res.json({ ok: false, message: 'username or password incorrect' });            
            }
        })
        .catch(err => handleError(res, err, 'error authentication user', 500));
})

module.exports = router
