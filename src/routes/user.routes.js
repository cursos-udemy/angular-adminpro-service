
const express = require('express');

const UserModel = require('../models/user.model');
const handleError = require('../utils/errors.util');
const auth = require('../middleware/authentication');

const router = express.Router();

router.get('/', (req, res, next) => {
    UserModel.find({}, 'name email role image')
        .then(users => {
            res.status(200);
            res.json({ ok: true, users, });
        })
        .catch(err => handleError(res, err, 'error consulting users'));
});

router.post('/', auth.validateToken, (req, res, next) => {
    const data = getUserDataForCreate(req);
    const user = new UserModel(data);
    user.save()
        .then(userInserted => {
            res.status(201);
            res.json({ ok: true, user: userInserted });
        })
        .catch(err => handleError(res, err, 'error creating user', 400));
});

router.put('/:id', auth.validateToken, (req, res, next) => {
    const id = req.params.id;
    const data = getUserDataForUpdate(req);
    UserModel.findByIdAndUpdate(id, data, { new: true })
        .then(userUpdated => {
            if (userUpdated) {
                res.status(200);
                let user = { ...userUpdated._doc };
                delete user.password;
                //let user = userUpdated
                res.json({ ok: true, user });
            } else {
                res.status(400);
                res.json({ ok: false, message: 'User not found', error: `user id '${id}' not found` });
            }
        })
        .catch(err => handleError(res, err, 'error updating user', 500));
});

router.delete('/:id', auth.validateToken, (req, res, next) => {
    const id = req.params.id;
    UserModel.findByIdAndDelete(id)
        .then(userDeleted => {
            console.log(userDeleted);
            if (userDeleted) {
                res.status(200);
                res.json({ ok: true, message: 'user successfully removed' });
            } else {
                res.status(400);
                res.json({ ok: false, message: 'User not found', error: `user id '${id}' not found` });
            }
        })
        .catch(err => handleError(res, err, 'error updating user', 500));
});

function getUserDataForCreate(req) {
    const { email, password, name, image, role } = req.body;
    const data = {};
    if (email) data.email = email;
    if (password) data.password = password;
    if (name) data.name = name;
    if (image) data.image = image;
    if (role) data.role = role;
    return data;
}

function getUserDataForUpdate(req) {
    const { email, name, image, role } = req.body;
    const data = {};
    if (email) data.email = email;
    if (name) data.name = name;
    if (image) data.image = image;
    if (role) data.role = role;
    return data;
}

module.exports = router;