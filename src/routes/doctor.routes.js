const express = require('express');

const DoctorModel = require('../models/doctor.model');
const handleError = require('../utils/errors.util');
const auth = require('../middleware/authentication');
const normalizePaging = require('../utils/normalizer');
const doctorRepository = require('../repositories/doctor.repository');

const router = express.Router();

router.get('/', (req, res, next) => {
    const paging = normalizePaging(req);
    doctorRepository.findAll(paging)
        .then(doctors => res.status(200).json(doctors))
        .catch(err => handleError(res, err, 'error consulting doctors', 500))
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    doctorRepository.findById(id)
        .then(doctor => {
            if (doctor) {
                res.status(200).json(doctor)
            } else {
                res.status(404);
            }
        })
        .catch(err => handleError(res, err, 'error consulting doctor', 500))
});

router.post('/', auth.validateToken, (req, res, next) => {
    const doctor = getDotorData(req);
    doctorRepository.save(doctor)
        .then(doctorInserted => res.status(201).json(doctorInserted))
        .catch(err => handleError(res, err, 'error creating doctor', 400));
});

router.put('/:id', auth.validateToken, (req, res, next) => {
    const id = req.params.id;
    const doctor = getDotorData(req);
    doctorRepository.update(id, doctor)
        .then(doctorUpdated => {
            if (doctorUpdated) {
                res.status(200).json(doctorUpdated);
            } else {
                res.status(400).json({ message: 'Doctor not found', error: `Doctor id '${id}' not found` });
            }
        })
        .catch(err => handleError(res, err, 'error updating doctor', 500));
});

router.delete('/:id', auth.validateToken, (req, res, next) => {
    const id = req.params.id;
    doctorRepository.remove(id)
        .then(doctorDeleted => {
            if (doctorDeleted) {
                res.status(200).json({ message: 'Doctor successfully removed' });
            } else {
                res.status(400).json({ message: 'Doctor not found', error: `Doctor id '${id}' not found` });
            }
        })
        .catch(err => handleError(res, err, 'error removing hospital', 500));
});

function getDotorData(req) {
    const { name, image, user, hospital } = req.body;
    const data = {};
    if (name) data.name = name;
    if (image) data.image = image;
    if (user) data.user = user;
    if (hospital) data.hospital = hospital;
    return data;
}

module.exports = router;
