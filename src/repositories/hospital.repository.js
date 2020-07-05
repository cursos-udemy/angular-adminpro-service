const HospitalModel = require('../models/hospital.model');

function findAll(paging) {
    const options = {
        sort: { name: 1 },
        populate: { path: 'user', select: 'name email' },
        page: paging.page,
        limit: paging.limit
    };
    return HospitalModel.paginate({}, options);
}

function searchByName(text, paging) {
    const options = {
        sort: { name: 1 },
        populate: { path: 'user', select: 'name email' },
        page: paging.page,
        limit: paging.limit
    };
    const regex = new RegExp(text.trim(), 'i');
    return HospitalModel.paginate({ name: regex }, options);
}

function findById(id) {
    return HospitalModel.findById(id)
        .populate({ path: 'user', select: 'name email' })
}

function save(hospital) {
    const newHospital = new HospitalModel(hospital);
    return newHospital.save();
}

function update(id, hospital) {
    return HospitalModel.findByIdAndUpdate(id, hospital, { new: true })
}

function remove(id) {
    return HospitalModel.findByIdAndDelete(id);
}

module.exports = {
    findAll,
    searchByName,
    findById,
    save,
    update,
    remove
}