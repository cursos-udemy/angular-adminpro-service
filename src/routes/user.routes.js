const express = require('express');

const auth = require('../middleware/authentication');
const { check } = require('express-validator');
const { validateRequest } = require('../middleware/request-validators')
const { findAll, create, updateProfile, updateAdmin, remove } = require('../controllers/user.controller');

const router = express.Router();

router.get('/', auth.validateToken, findAll);

router.post('/signup',
    [
        check('name', 'name is required').notEmpty(),
        check('email', 'email is required').notEmpty(),
        check('email', 'email is invalid').isEmail(),
        check('password', 'password is required').notEmpty(),
        validateRequest
    ],
    create);

router.put('/profile/:id',
    [
        auth.validateToken,
        auth.isTheUserOwner,
        check('id', 'id invalid').isMongoId(),
        check('name', 'name is required').optional().notEmpty(),
        check('email', 'email is invalid').optional().isEmail(),
        validateRequest
    ],
    updateProfile);

router.put('/admin/:id',
    [
        auth.validateToken,
        auth.hasRoleAdmin,
        auth.doesNotOperateOnItself,
        check('id', 'id invalid').isMongoId(),
        check('image').optional(),
        check('role').optional().isIn(['ROLE_ADMIN', 'ROLE_USER']),
        validateRequest
    ],
    updateAdmin);

router.delete('/:id',
    [
        auth.validateToken,
        auth.hasRoleAdmin,
        auth.doesNotOperateOnItself,
        check('id', 'id invalid').isMongoId(),
        validateRequest
    ],
    remove);

module.exports = router;