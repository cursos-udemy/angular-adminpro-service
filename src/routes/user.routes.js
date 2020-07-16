const express = require('express');

const auth = require('../middleware/authentication');
const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/request-validators')
const { findAll, create, updateProfile, updateAdmin, remove } = require('../controllers/user.controller');

const router = express.Router();

router.get('/', auth.validateToken, findAll);

router.post('/signup',
    [
        body('name', 'name is required').notEmpty(),
        body('email', 'email is required').notEmpty(),
        body('email', 'email is invalid').isEmail(),
        body('password', 'password is required').notEmpty(),
        validateRequest
    ],
    create);

router.put('/profile/:id',
    [
        auth.validateToken,
        auth.isTheUserOwner,
        param('id', 'id invalid').isMongoId(),
        body('name', 'name is required').optional().notEmpty(),
        body('email', 'email is invalid').optional().isEmail(),
        validateRequest
    ],
    updateProfile);

router.put('/admin/:id',
    [
        auth.validateToken,
        auth.hasRoleAdmin,
        auth.doesNotOperateOnItself,
        param('id', 'id invalid').isMongoId(),
        body('image').optional(),
        body('role').optional().isIn(['ROLE_ADMIN', 'ROLE_USER']),
        validateRequest
    ],
    updateAdmin);

router.delete('/:id',
    [
        auth.validateToken,
        auth.hasRoleAdmin,
        auth.doesNotOperateOnItself,
        param('id', 'id invalid').isMongoId(),
        validateRequest
    ],
    remove);

module.exports = router;