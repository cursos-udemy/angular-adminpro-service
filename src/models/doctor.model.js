const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const doctorSchema = mongoose.Schema({
    name: { type: String, required: [true, 'name is required'], index: true },
    image: { type: String, required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'user is required'] },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'hospital is required'] }
}, { collection: 'doctors' });


doctorSchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();
    return { ...object }
});


doctorSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Doctor', doctorSchema);