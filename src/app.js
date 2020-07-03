const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routes = require('./routes');

//config database
mongoose.connect('mongodb://localhost/hospital-db', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(res => console.log('database conection OK'))
    .catch(err => { throw err });

//initialize express
const app = express();

//config body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// config routes
app.use('/api/v1', routes);

// start server
const port = 9000;
app.listen(port, () => {
    console.log(`Admin Pro Service Listening on port ${port}`);
});

