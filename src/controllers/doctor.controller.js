const handleError = require('../utils/error-util');
const normalizePaging = require('../utils/normalizer');
const doctorRepository = require('../repositories/doctor.repository');

const findAll = async (req, res) => {
    const paging = normalizePaging(req);
    console.log('doctor.findAll -> paging: ', paging);
    doctorRepository.findAll(paging)
        .then(doctors => res.json(doctors))
        .catch(err => handleError(res, err, 'error consulting doctors', 500))
}

const findById = async (req, res) => {
    const { id } = req.params;
    console.log('doctor.findById -> id: ', id);
    doctorRepository.findById(id)
        .then(doctor => {
            if (doctor) {
                res.json(doctor)
            } else {
                res.status(404);
            }
        })
        .catch(err => handleError(res, err, 'error consulting doctor', 500))
}

const create = async (req, res) => {
    const doctor = getDoctorData(req);
    console.log('doctor.create -> doctor ', doctor.name);
    doctorRepository.save(doctor)
        .then(doctorInserted => res.status(201).json(doctorInserted))
        .catch(err => handleError(res, err, 'error creating doctor', 400));
}

const update = async (req, res) => {
    const { id } = req.params;
    console.log('doctor.update -> id ', id);
    const doctor = getDoctorData(req);
    doctorRepository.update(id, doctor)
        .then(doctorUpdated => {
            if (doctorUpdated) {
                res.json(doctorUpdated);
            } else {
                res.status(400).json({ message: 'Doctor not found', error: `Doctor id '${id}' not found` });
            }
        })
        .catch(err => handleError(res, err, 'error updating doctor', 500));
}

const remove = async (req, res) => {
    const { id } = req.params;
    console.log('doctor.remove -> id ', id);
    doctorRepository.remove(id)
        .then(doctorDeleted => {
            if (doctorDeleted) {
                res.json({ message: 'Doctor successfully removed' });
            } else {
                res.status(400).json({ message: 'Doctor not found', error: `Doctor id '${id}' not found` });
            }
        })
        .catch(err => handleError(res, err, 'error removing hospital', 500));
}

function getDoctorData(req) {
    const { name, image, hospital } = req.body;
    const data = { user: req.user._id };
    if (name) data.name = name;
    if (image) data.image = image;
    if (hospital) data.hospital = hospital;
    return data;
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};
