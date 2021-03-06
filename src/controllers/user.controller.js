const userRepository = require('../repositories/user.repository');
const handleError = require('../utils/error-util');
const normalizePaging = require('../utils/normalizer');

const findAll = async (req, res) => {
    const paging = normalizePaging(req);
    console.log('user.findAll -> paging: ', paging);
    userRepository.findAll(paging)
        .then(users => res.json(users))
        .catch(err => handleError(res, err, 'error consulting users'));
}

const create = async (req, res) => {
    const user = getUserDataForCreate(req);

    console.log('user.create -> mail ', user.email);
    const userRegistered = await userRepository.findByEmail(user.email);
    if (userRegistered) return res.status(400).json({message: 'There is already a registered user with the email account'})

    userRepository.save(user)
        .then(userInserted => res.status(201).json(userInserted))
        .catch(err => handleError(res, err, 'error creating user', 400));
}

const updateProfile = async (req, res) => {
    const { id } = req.params;
    console.log('user.updateProfile -> id: ', id);
    const user = getUserDataForUpdateProfile(req);
    update(id, user, res);
}

const updateAdmin = async (req, res) => {
    const { id } = req.params;
    console.log('user.updateRole() -> id: ', id);
    const user = getUserDataForUpdateAdmin(req);
    update(id, user, res)
}

const remove = async (req, res) => {
    const { id } = req.params;
    console.log('user.delete() -> id: ', id);
    userRepository.remove(id)
        .then(userDeleted => {
            if (userDeleted) {
                res.json({ message: 'user successfully removed' });
            } else {
                res.status(400).json({ message: 'User not found', error: `user id '${id}' not found` });
            }
        })
        .catch(err => handleError(res, err, 'error removing user', 500));
}

function update(id, user, res) {
    userRepository.update(id, user)
        .then(userUpdated => {
            if (userUpdated) {
                res.json(userUpdated);
            } else {
                res.status(400).json({ message: 'User not found', error: `user id '${id}' not found` });
            }
        })
        .catch(err => {
            if (err.type === 'valid') {
                return res.status(400).json({ message: err.message});
            }
            return handleError(res, err, 'error updating user', 500)}
        );
}

function getUserDataForCreate(req) {
    const { email, password, name, image } = req.body;
    const data = {};
    if (email) data.email = email;
    if (password) data.password = password;
    if (name) data.name = name;
    if (image) data.image = image;
    return data;
}

function getUserDataForUpdateProfile(req) {
    const { email, name, image } = req.body;
    const data = {};
    if (email) data.email = email;
    if (name) data.name = name;
    if (image) data.image = image;
    return data;
}

function getUserDataForUpdateAdmin(req) {
    const { image, role, email } = req.body;
    const data = {};
    if (email) data.email = email;
    if (image) data.image = image;
    if (role) data.role = role;
    return data;
}

module.exports = {
    findAll,
    create,
    updateProfile,
    updateAdmin,
    remove
}