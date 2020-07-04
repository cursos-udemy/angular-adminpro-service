const express = require('express');

const UserModel = require('../models/user.model');
const handleError = require('../utils/errors.util');
const auth = require('../middleware/authentication');
const normalizePaging = require('../utils/normalizer')

const router = express.Router();

router.get('/', (req, res, next) => {
    const paging = normalizePaging(req);
    const options = {
        select: 'email name role image',
        sort: { name: 1 },
        //populate: 'author',        
        page: paging.page,
        limit: paging.limit
    };
    UserModel.paginate({}, options)
        .then(users => res.status(200).json(users))
        .catch(err => handleError(res, err, 'error consulting users'));
});

router.post('/', auth.validateToken, (req, res, next) => {
    const data = getUserDataForCreate(req);
    const user = new UserModel(data);
    user.save()
        .then(userInserted => {
            let user = filterPassword(userInserted);
            res.status(201).json(user);
        })
        .catch(err => handleError(res, err, 'error creating user', 400));
});

router.put('/:id', auth.validateToken, (req, res, next) => {
    const id = req.params.id;
    const data = getUserDataForUpdate(req);
    UserModel.findByIdAndUpdate(id, data, { new: true })
        .then(userUpdated => {
            if (userUpdated) {
                let user = filterPassword(userUpdated);
                res.status(200).json(user);
            } else {
                res.status(400).json({ message: 'User not found', error: `user id '${id}' not found` });
            }
        })
        .catch(err => handleError(res, err, 'error updating user', 500));
});

router.delete('/:id', auth.validateToken, (req, res, next) => {
    const id = req.params.id;
    UserModel.findByIdAndDelete(id)
        .then(userDeleted => {
            if (userDeleted) {
                res.status(200).json({ message: 'user successfully removed' });
            } else {
                res.status(400).json({ message: 'User not found', error: `user id '${id}' not found` });
            }
        })
        .catch(err => handleError(res, err, 'error removing user', 500));
});

function filterPassword(user) {
    let filteredUser = { ...user._doc };
    delete filteredUser.password;
    return filteredUser;
}

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