const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({
    name: { type: String, required: [true, 'name is required'] },
    image: { type: String, required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'hospital is required'] }
}, { collection: 'doctors' });

module.exports = mongoose.model('Doctor', doctorSchema);