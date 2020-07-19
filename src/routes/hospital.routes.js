const express = require('express');

const auth = require('../middleware/authentication');
const { findAll, findById, create, update, remove } = require('../controllers/hospital.controller');
const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/request-validators')

const router = express.Router();

router.get('/', auth.validateToken, findAll);

router.get('/:id', auth.validateToken, findById);

router.post('/',
    [
        auth.validateToken,
        body('name', 'name is required').notEmpty(),
        validateRequest
    ]
    , create);

router.put('/:id',
    [
        auth.validateToken,
        param('id', 'id invalid').isMongoId(),
        body('name', 'name is required').notEmpty(),
        validateRequest
    ],
    update);

router.delete('/:id',
    [
        auth.validateToken,
        param('id', 'id invalid').isMongoId(),
        validateRequest
    ],
    remove);

module.exports = router;
