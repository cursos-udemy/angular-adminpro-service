const express = require('express');

const DoctorModel = require('../models/doctor.model');
const handleError = require('../utils/errors.util');
const auth = require('../middleware/authentication');
const normalizePaging = require('../utils/normalizer')

const router = express.Router();

router.get('/', (req, res, next) => {
    const paging = normalizePaging(req);
    const options = {
        sort: { name: 1 },
        populate: { path: 'user', select: 'name email' },
        populate: { path: 'hospital', select: 'name' },
        page: paging.page,
        limit: paging.limit
    };

    DoctorModel.paginate({}, options)
        .then(doctors => res.status(200).json(doctors))
        .catch(err => handleError(res, err, 'error consulting doctors', 500))
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    DoctorModel.findById(id)
        .populate({ path: 'user', select: 'name email' })
        .populate({ path: 'hospital', select: 'name' })
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
    const data = getDotorData(req);
    const doctor = new DoctorModel(data);
    doctor.save()
        .then(doctorInserted => res.status(201).json(doctorInserted))
        .catch(err => handleError(res, err, 'error creating doctor', 400));
});

router.put('/:id', auth.validateToken, (req, res, next) => {
    const id = req.params.id;
    const data = getDotorData(req);
    DoctorModel.findByIdAndUpdate(id, data, { new: true })
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
    DoctorModel.findByIdAndDelete(id)
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