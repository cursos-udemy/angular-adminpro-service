const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const config = require('./config/config');
const routes = require('./routes');

//config database
mongoose.connect(config.MONGO_DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(res => console.log('database conection OK'))
    .catch(err => { throw err });

//initialize express
const app = express();

//config body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// config routes
app.use('/api/v1', routes);

// start server
app.listen(config.PORT, () => {
    console.log(`Admin Pro Service Listening on port ${config.PORT}`);
});

