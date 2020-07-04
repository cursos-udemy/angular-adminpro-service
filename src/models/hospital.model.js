const mongoose = require('mongoose');

const hospitalSchema = mongoose.Schema({
    name: { type: String, required: [true, 'name is required'] },
    image: { type: String, required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { collection: 'hospitals' });

module.exports = mongoose.model('Hospital', hospitalSchema);