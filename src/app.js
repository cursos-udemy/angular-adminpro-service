const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const config = require('./config/config');
const routes = require('./routes');

//config database
const dbOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(config.MONGO_DATABASE_URI, dbOptions)
    .then(res => console.log(`mongoose version: ${mongoose.version}`))
    .catch(err => { throw err });

//initialize express
const app = express();

//config body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// config routes
app.use('/api/v1', routes);

const serveIndex = require('serve-index');
const path = require('path');
const directory = path.resolve( __dirname, '../');
app.use(express.static(directory + '/'));
app.use('/public', serveIndex(directory + '/public'));

// start server
app.listen(config.PORT, () => {
    console.log(`Admin Pro Service Listening on port ${config.PORT}`);
});

