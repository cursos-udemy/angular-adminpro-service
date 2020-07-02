const mongoose = require('mongoose');

var userSchema = new mongoose.Schema(
    {
        email: { type: String, required: [true, 'email is required'], unique: true },
        password: { type: String, required: [true, 'pasword is required'] },
        name: { type: String, required: [true, 'name is required'] },
        image: { type: String, required: false },
        role: { type: String, required: true, default: 'ROLE_USER' },
        googleAccount: { type: Boolean, required: false }
    });

module.exports = mongoose.model('User', userSchema);