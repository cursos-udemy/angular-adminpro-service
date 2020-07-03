const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const allowedRoles = {
    values: ['ROLE_ADMIN', 'ROLE_USER'],
    message: 'role {VALUE} not allow'
}

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: [true, 'email is required'], unique: true, trim: true },
        password: { type: String, required: [true, 'pasword is required'] },
        name: { type: String, required: [true, 'name is required'], trim: true },
        image: { type: String, required: false },
        role: { type: String, required: true, default: 'ROLE_USER', enum: allowedRoles, uppercase: true },
        googleAccount: { type: Boolean, required: false }
    });

userSchema.plugin(uniqueValidator, { message: 'There is already a registered user with the email account {VALUE}' });

module.exports = mongoose.model('User', userSchema);