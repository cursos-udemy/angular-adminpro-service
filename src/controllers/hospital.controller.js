const handleError = require('../utils/error-util');
const normalizePaging = require('../utils/normalizer');
const hospitalRepository = require('../repositories/hospital.repository');

const findAll = async (req, res) => {
    const paging = normalizePaging(req);
    console.log('hospital.findAll -> paging: ', paging);
    hospitalRepository.findAll(paging)
        .then(hospitals => res.json(hospitals))
        .catch(err => handleError(res, err, 'error consulting hospitals', 500))
}

const findById = async (req, res) => {
    const { id } = req.params;
    console.log('hospital.findById -> id: ', id);
    hospitalRepository.findById(id)
        .then(hospital => {
            if (hospital) {
                res.json(hospital)
            } else {
                res.status(404);
            }
        })
        .catch(err => handleError(res, err, 'error consulting hospital', 500))
}

const create = async (req, res) => {
    const hospital = getHospitalData(req);
    console.log('hospital.create -> hospital ', hospital.name);
    hospitalRepository.save(hospital)
        .then(hospitalInserted => res.status(201).json(hospitalInserted))
        .catch(err => handleError(res, err, 'error creating hospital', 400));
}

const update = async (req, res) => {
    const { id } = req.params;
    console.log('hospital.update -> id ', id);
    const data = getHospitalData(req);
    hospitalRepository.update(id, data)
        .then(hospitalUpdated => {
            if (hospitalUpdated) {
                res.json(hospitalUpdated);
            } else {
                res.status(400).json({ message: 'Hospital not found', error: `hospital id '${id}' not found` });
            }
        })
        .catch(err => handleError(res, err, 'error updating hospital', 500));
}

const remove = async (req, res) => {
    const { id } = req.params;
    console.log('hospital.remove -> id ', id);
    hospitalRepository.remove(id)
        .then(hospitalDeleted => {
            if (hospitalDeleted) {
                res.json({ message: 'Hospital successfully removed' });
            } else {
                res.status(400).json({ message: 'Hospital not found', error: `hospital id '${id}' not found` });
            }
        })
        .catch(err => handleError(res, err, 'error removing hospital', 500));
}

function getHospitalData(req) {
    const { name, image } = req.body;
    const data = { user: req.user._id };
    if (name) data.name = name;
    if (image) data.image = image;

    return data;
}

module.exports = {
    findAll,
    findById,
    create,
    update, 
    remove
};
