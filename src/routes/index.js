const express = require('express');

const app = express();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const hospitalRoutes = require('./hospital.routes');
const doctorRoutes = require('./doctor.routes');
const searchRoutes = require('./search.routes');

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRoutes);
app.use('/search', searchRoutes);

module.exports = app;