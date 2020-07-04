const express = require('express');

const HospitalModel = require('../models/hospital.model');
const handleError = require('../utils/errors.util');
const auth = require('../middleware/authentication');
const normalizePaging = require('../utils/normalizer')

const router = express.Router();

router.get('/', (req, res, next) => {

    const paging = normalizePaging(req);
    const options = {
        sort: { name: 1 },
        populate: { path: 'user', select: 'name email' },
        page: paging.page,
        limit: paging.limit
    };

    HospitalModel.paginate({}, options)
        .then(hospitals => res.status(200).json(hospitals))
        .catch(err => handleError(res, err, 'error consulting hospitals', 500))
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    HospitalModel.findById(id)
        .populate({ path: 'user', select: 'name email' })
        .then(hospital => {
            if (hospital) {
                res.status(200).json(hospital)
            } else {
                res.status(404);
            }
        })
        .catch(err => handleError(res, err, 'error consulting hospital', 500))
});

router.post('/', auth.validateToken, (req, res, next) => {
    const data = getHospitalData(req);
    const hospital = new HospitalModel(data);
    hospital.save()
        .then(hospitalInserted => res.status(201).json(hospitalInserted))
        .catch(err => handleError(res, err, 'error creating hospital', 400));
});

router.put('/:id', auth.validateToken, (req, res, next) => {
    const id = req.params.id;
    const data = getHospitalData(req);
    HospitalModel.findByIdAndUpdate(id, data, { new: true })
        .then(hospitalUpdated => {
            if (hospitalUpdated) {
                res.status(200).json(hospitalUpdated);
            } else {
                res.status(400).json({ message: 'Hospital not found', error: `hospital id '${id}' not found` });
            }
        })
        .catch(err => handleError(res, err, 'error updating hospital', 500));
});


router.delete('/:id', auth.validateToken, (req, res, next) => {
    const id = req.params.id;
    HospitalModel.findByIdAndDelete(id)
        .then(hospitalDeleted => {
            if (hospitalDeleted) {
                res.status(200).json({ message: 'Hospital successfully removed' });
            } else {
                res.status(400).json({ message: 'Hospital not found', error: `hospital id '${id}' not found` });
            }
        })
        .catch(err => handleError(res, err, 'error removing hospital', 500));
});

function getHospitalData(req) {
    const { name, image, user } = req.body;
    const data = {};
    if (name) data.name = name;
    if (image) data.image = image;
    if (user) data.user = user;
    return data;
}

module.exports = router;
