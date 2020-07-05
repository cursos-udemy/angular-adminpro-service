const express = require('express');

const hospitalRepository = require('../repositories/hospital.repository');
const doctorRepository = require('../repositories/doctor.repository');
const userRepository = require('../repositories/user.repository');
const handleError = require('../utils/errors.util');
const normalizePaging = require('../utils/normalizer');

const router = express.Router();

router.get('/all/:text', (req, res, next) => {
    const { text } = req.params;
    const paging = normalizePaging(req);

    const searchAll = [
        hospitalRepository.searchByName(text, paging),
        doctorRepository.searchByName(text, paging),
        userRepository.searchByName(text, paging)
    ];

    Promise.all(searchAll)
        .then(data => res.status(200).json(createResponse(data)))
        .catch(err => handleError(res, err, 'error searching', 500))
});

router.get('/doctor/:text', (req, res, next) => {
    const { text } = req.params;
    const paging = normalizePaging(req);
    doctorRepository.searchByName(text, paging)
        .then(doctors => res.status(200).json(doctors))
        .catch(err => handleError(res, err, 'error searching doctor', 500))
});

router.get('/hospital/:text', (req, res, next) => {
    const { text } = req.params;
    const paging = normalizePaging(req);
    hospitalRepository.searchByName(text, paging)
        .then(hospitals => res.status(200).json(hospitals))
        .catch(err => handleError(res, err, 'error searching hospital', 500))
});

router.get('/user/:text', (req, res, next) => {
    const { text } = req.params;
    const paging = normalizePaging(req);
    userRepository.searchByName(text, paging)
        .then(users => res.status(200).json(users))
        .catch(err => handleError(res, err, 'error searching user', 500))
});

function createResponse(data) {
    return { hospitals: data[0], doctors: data[1], users: data[2] }
}

module.exports = router;
