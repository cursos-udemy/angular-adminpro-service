const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost/hospital-db', { useNewUrlParser: true })
    .then(res => console.log('database conection OK'))
    .catch(err => { throw err });

app.get('/', (req, res, next) => {
    res.status(200);
    res.json({
        ok: true,
        message: 'Hola mundo desde NodeJs + Express'
    });
});

const port = 9000;
app.listen(port, () => {
    console.log(`Admin Pro Service Listening on port ${port}`);
})

