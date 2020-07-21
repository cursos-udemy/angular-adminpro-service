const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config/config');
const { dbConnection } = require('./database.config')
const routes = require('./routes');

//config database
dbConnection();

//initialize express
const app = express();

//config CORS
app.use(cors());

//config body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//app.use(express.json())

// config routes
app.use('/api/v1', routes);

//app.get('*', (req, res) => {
//    res.sendFile(path.resolve(__dirname, '../public/index.html'));
//});

//const serveIndex = require('serve-index');
//const path = require('path');
//const directory = path.resolve(__dirname, '../');
//app.use(express.static(directory + '/'));
//app.use('/public', serveIndex(directory + '/public'));

// Directorio público
app.use(express.static('public'));

// start server
app.listen(config.PORT, () => {
    console.log(`Admin Pro Service Listening on port ${config.PORT}`);
});

