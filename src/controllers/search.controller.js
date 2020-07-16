
const hospitalRepository = require('../repositories/hospital.repository');
const doctorRepository = require('../repositories/doctor.repository');
const userRepository = require('../repositories/user.repository');
const handleError = require('../utils/error-util');
const normalizePaging = require('../utils/normalizer');

const searchAll = async (req, res) => {
    const { text } = req.params;
    const paging = normalizePaging(req);
    console.log('search.all -> ', text, paging);

    const searchAll = [
        hospitalRepository.searchByName(text, paging),
        doctorRepository.searchByName(text, paging),
        userRepository.searchByName(text, paging)
    ];

    Promise.all(searchAll)
        .then(data => res.json({ hospitals: data[0], doctors: data[1], users: data[2] }))
        .catch(err => handleError(res, err, 'error searching all', 500))
}

const searchDoctors = async (req, res) => {
    const { text } = req.params;
    const paging = normalizePaging(req);
    console.log('search.doctors -> ', text, paging);
    doctorRepository.searchByName(text, paging)
        .then(doctors => res.json(doctors))
        .catch(err => handleError(res, err, 'error searching doctor', 500))
}

const searchHospitals = async (req, res) => {
    const { text } = req.params;
    const paging = normalizePaging(req);
    console.log('search.hospitals -> ', text, paging);
    hospitalRepository.searchByName(text, paging)
        .then(hospitals => res.json(hospitals))
        .catch(err => handleError(res, err, 'error searching hospital', 500))
}

const searchUsers = async (req, res) => {
    const { text } = req.params;
    const paging = normalizePaging(req);
    console.log('search.users -> ', text, paging);
    userRepository.searchByName(text, paging)
        .then(users => res.json(users))
        .catch(err => handleError(res, err, 'error searching user', 500))
}

module.exports = {
    searchAll,
    searchDoctors,
    searchHospitals,
    searchUsers
};
