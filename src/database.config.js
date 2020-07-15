const mongoose = require('mongoose');
const config = require('./config/config');

const dbConnection = async () => {
    try {
        const dbOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
        await mongoose.connect(config.MONGO_DATABASE_URI, dbOptions);
        console.log(`Database OK. mongoose version: ${mongoose.version}`);
    } catch (err) {
        console.error(err)
        throw new Error('Error when trying to connect to the database');
    }
}

module.exports = {
    dbConnection
}