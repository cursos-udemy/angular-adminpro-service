const UserModel = require('../models/user.model');

const USER_FIELD_SELECT = 'email name role image googleAccount';
function findAll(paging) {
    const options = {
        select: USER_FIELD_SELECT,
        sort: { name: 1 },
        page: paging.page || 1,
        limit: paging.limit || 1
    };
    return UserModel.paginate({}, options);
}

function findById(id) {
    return UserModel.findById(id).select(USER_FIELD_SELECT);
}

function findByEmail(email) {
    return UserModel.findOne({email});
}

function searchByName(text, paging) {
    const options = {
        select: USER_FIELD_SELECT,
        sort: { name: 1 },
        page: paging.page || 1,
        limit: paging.limit || 1
    };
    const regex = new RegExp(text.trim(), 'i');
    const conditions = { $or: [{ name: regex }, { email: regex }] };
    return UserModel.paginate(conditions, options);
}

async function save(user) {
    const newUser = new UserModel(user);
    return newUser.save()
        .then(userInserted => {
            if (userInserted) return Promise.resolve(filterPassword(userInserted));
            return userInserted;
        });
}

async function update(id, user) {
    return UserModel.findById(id)
        .then(u => {
            if (u) {
                if (u.googleAccount) {
                    delete user.email;
                    user.password = ';-)';
                }
                return UserModel.findByIdAndUpdate(id, user, { new: true })
                    .then(userUpdated => {
                        if (userUpdated) return Promise.resolve(filterPassword(userUpdated));
                        return userUpdated;
                    });
            }
            return u;
        });
}

function remove(id) {
    return UserModel.findByIdAndDelete(id);
}

async function authenticate(email, password) {
    return UserModel.findOne({ email })
        .then(user => {
            if (user && !user.googleAccount && user.verifyPasswordSync(password)) {
                return Promise.resolve(filterPassword(user));
            }
            return Promise.reject('invalid credentials')
        })
        .catch(err => handleError(res, err, 'error authentication user', 500));
}

async function checkGoogleAccount(googleUser) {
    return UserModel.findOne({ email: googleUser.email })
        .then(user => {
            if (!user) return save(getUserFormGoogleAccount(googleUser));
            if (user.googleAccount) return Promise.resolve(filterPassword(user));
            return Promise.reject('there is already an account created with your email address')
        })
        .catch(err => handleError(res, err, 'error checking account user', 500));
}

function filterPassword(user) {
    let filteredUser = { ...user._doc };
    delete filteredUser.password;
    return filteredUser;
}

function getUserFormGoogleAccount(googleAccount) {
    return {
        name: googleAccount.name,
        email: googleAccount.email,
        image: googleAccount.picture,
        password: ';)',
        googleAccount: true,
    };
}

module.exports = {
    findAll,
    findById,
    findByEmail,
    searchByName,
    save,
    update,
    remove,
    authenticate,
    checkGoogleAccount
}