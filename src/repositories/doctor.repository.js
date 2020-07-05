const DoctorModel = require('../models/doctor.model');

function findAll(paging) {
    const options = {
        sort: { name: 1 },
        populate: { path: 'user', select: 'name email' },
        populate: { path: 'hospital', select: 'name' },
        page: paging.page || 1,
        limit: paging.limit || 1
    };
    return DoctorModel.paginate({}, options);
}

function searchByName(text, paging) {
    const options = {
        sort: { name: 1 },
        populate: { path: 'user', select: 'name email' },
        populate: { path: 'hospital', select: 'name' },
        page: paging.page,
        limit: paging.limit
    };
    const regex = new RegExp(text.trim(), 'i');
    return DoctorModel.paginate({ name: regex }, options);
}

function findById(id) {
    return DoctorModel.findById(id)
        .populate({ path: 'user', select: 'name email' })
        .populate({ path: 'hospital', select: 'name' });
}

function save(doctor) {
    const newDoctor = new DoctorModel(doctor);
    return newDoctor.save();
}

function update(id, doctor) {
    return DoctorModel.findByIdAndUpdate(id, doctor, { new: true });
}

function remove(id) {
    return DoctorModel.findByIdAndDelete(id);
}

module.exports = {
    findAll,
    searchByName,
    findById,
    save,
    update,
    remove
}