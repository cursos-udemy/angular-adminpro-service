const express = require('express');

const auth = require('../middleware/authentication');
const { searchAll, searchUsers, searchHospitals, searchDoctors } = require('../controllers/search.controller');
const { param } = require('express-validator');
const { validateRequest } = require('../middleware/request-validators')

const router = express.Router();

const validationsRoute = [
    auth.validateToken,    
    param('text', 'text to search is required').notEmpty(),
    param('text', 'search text must be at least 1 characters long').isLength({ min: 1 }),
    validateRequest
];

router.get('/all/:text', validationsRoute, searchAll);

router.get('/doctor/:text', validationsRoute, searchDoctors);

router.get('/hospital/:text', validationsRoute, searchHospitals);

router.get('/user/:text', validationsRoute, searchUsers);

module.exports = router;
