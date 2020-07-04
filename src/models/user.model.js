const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongooseBcrypt = require('mongoose-bcrypt');
const mongoosePaginate = require('mongoose-paginate-v2');

const allowedRoles = {
    values: ['ROLE_ADMIN', 'ROLE_USER'],
    message: 'role {VALUE} not allow'
}

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: [true, 'email is required'], unique: true, trim: true, index: true },
        password: { type: String, required: [true, 'pasword is required'], bcrypt: true },
        name: { type: String, required: [true, 'name is required'], trim: true, index: true },
        image: { type: String, required: false },
        role: { type: String, required: [true, 'role is required'], default: 'ROLE_USER', enum: allowedRoles, uppercase: true },
        googleAccount: { type: Boolean, required: false }
    }, { collation: 'users' });

userSchema.plugin(uniqueValidator, { message: 'There is already a registered user with the email account {VALUE}' });
userSchema.plugin(mongooseBcrypt, { rounds: 8 });
userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);