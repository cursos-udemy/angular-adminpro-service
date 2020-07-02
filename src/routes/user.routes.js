
const express = require('express');
const UserModel = require('../models/user.model');
const handleError = require('../utils/errors.util')
const routes = express();

routes.get('/', (req, res, next) => {
    UserModel.find({}, 'name email role image')
        .then(users => {
            res.status(200);
            res.json({
                ok: true,
                users,
            });
        })
        .catch(err => {
            handleError(res, err, 'error consulting users');
        });
});

routes.post('/', (req, res, next) => {

    console.log( req.body);

    const user = new UserModel(req.body);
    user.save()
        .then(user => {
            res.status(201);
            res.json({
                ok: true,
                user,
            });
        })
        .catch(err => {
            handleError(res, err, 'error creating user');
        });
});

module.exports = routes;