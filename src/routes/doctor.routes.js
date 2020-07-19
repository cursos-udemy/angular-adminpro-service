const express = require('express');

const auth = require('../middleware/authentication');
const { findAll, findById, create, update, remove } = require('../controllers/doctor.controller');
const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/request-validators')

const router = express.Router();

router.get('/', auth.validateToken, findAll);

router.get('/:id',
    [
        auth.validateToken,
        param('id', 'id invalid').isMongoId()
    ],
    findById);

router.post('/',
    [
        auth.validateToken,
        body('name', 'name is required').notEmpty(),
        body('hospital', 'hospital is required').notEmpty(),
        body('hospital', 'hospital invalid').isMongoId(),
        validateRequest
    ]
    , create);

router.put('/:id',
    [
        auth.validateToken,
        param('id', 'id invalid').isMongoId(),
        body('name', 'name is required').optional().notEmpty(),
        body('hospital', 'hospital invalid').optional().isMongoId(),
        validateRequest
    ]
    , update);

router.delete('/:id',
    [
        auth.validateToken,
        auth.hasRoleAdmin,
        param('id', 'id invalid').isMongoId(),
        validateRequest
    ]
    , remove);

module.exports = router;
