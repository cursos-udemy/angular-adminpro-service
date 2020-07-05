const express = require('express');

const handleError = require('../utils/error-util');
const auth = require('../middleware/authentication');
const normalizePaging = require('../utils/normalizer');
const userRepository = require('../repositories/user.repository');

const router = express.Router();

router.get('/', (req, res) => {
    const paging = normalizePaging(req);
    userRepository.findAll(paging)
        .then(users => res.json(users))
        .catch(err => handleError(res, err, 'error consulting users'));
});

router.post('/', auth.validateToken, (req, res) => {
    const user = getUserDataForCreate(req);
    userRepository.save(user)
        .then(userInserted => res.status(201).json(userInserted))
        .catch(err => handleError(res, err, 'error creating user', 400));
});

router.put('/:id', auth.validateToken, (req, res) => {
    const id = req.params.id;
    const user = getUserDataForUpdate(req);
    userRepository.update(id, user)
        .then(userUpdated => {
            if (userUpdated) {
                res.json(userUpdated);
            } else {
                res.status(400).json({ message: 'User not found', error: `user id '${id}' not found` });
            }
        })
        .catch(err => handleError(res, err, 'error updating user', 500));
});

router.delete('/:id', auth.validateToken, (req, res) => {
    const id = req.params.id;
    userRepository.remove(id)
        .then(userDeleted => {
            if (userDeleted) {
                res.json({ message: 'user successfully removed' });
            } else {
                res.status(400).json({ message: 'User not found', error: `user id '${id}' not found` });
            }
        })
        .catch(err => handleError(res, err, 'error removing user', 500));
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