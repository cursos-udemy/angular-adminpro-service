const UserModel = require('../models/user.model');

function findAll(paging) {
    const options = {
        select: 'email name role image',
        sort: { name: 1 },
        page: paging.page || 1,
        limit: paging.limit || 1
    };
    return UserModel.paginate({}, options);
}

function findById(id) {
    return UserModel.findById(id).select('email name role image');
}

function searchByName(text, paging) {
    const options = {
        select: 'email name role image',
        sort: { name: 1 },
        page: paging.page || 1,
        limit: paging.limit || 1
    };
    const regex = new RegExp(text.trim(), 'i');
    const conditions = { $or: [{ name: regex }, { email: regex }] };
    return UserModel.paginate(conditions, options);
}

function save(user) {
    const newUser = new UserModel(user);
    return newUser.save()
        .then(userInserted => {
            if (userInserted) return filterPassword(userInserted);
            return userInserted;
        });
}

function update(id, user) {
    return UserModel.findByIdAndUpdate(id, user, { new: true })
        .then(userUpdated => {
            if (userUpdated) return filterPassword(userUpdated);
            return userUpdated;
        });
}

function remove(id) {
    return UserModel.findByIdAndDelete(id);
}

function filterPassword(user) {
    let filteredUser = { ...user._doc };
    delete filteredUser.password;
    return Promise.resolve(filteredUser);
}

module.exports = {
    findAll,
    findById,
    searchByName,
    save,
    update,
    remove
}