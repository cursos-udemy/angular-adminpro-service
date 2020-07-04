const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const hospitalSchema = mongoose.Schema({
    name: { type: String, required: [true, 'name is required'], index: true },
    image: { type: String, required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { collection: 'hospitals' });

hospitalSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Hospital', hospitalSchema);