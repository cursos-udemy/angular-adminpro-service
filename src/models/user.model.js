const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongooseBcrypt = require('mongoose-bcrypt');

const allowedRoles = {
    values: ['ROLE_ADMIN', 'ROLE_USER'],
    message: 'role {VALUE} not allow'
}

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: [true, 'email is required'], unique: true, trim: true },
        password: { type: String, required: [true, 'pasword is required'], bcrypt: true },
        name: { type: String, required: [true, 'name is required'], trim: true },
        image: { type: String, required: false },
        role: { type: String, required: [true, 'role is required'], default: 'ROLE_USER', enum: allowedRoles, uppercase: true },
        googleAccount: { type: Boolean, required: false }
    });

userSchema.plugin(uniqueValidator, { message: 'There is already a registered user with the email account {VALUE}' });
userSchema.plugin(mongooseBcrypt, { rounds: 8 });

module.exports = mongoose.model('users', userSchema);