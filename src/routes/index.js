
const express = require('express');

const app = express();

const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');

app.use('/user', userRoutes);
app.use('/auth', authRoutes);

module.exports = app;