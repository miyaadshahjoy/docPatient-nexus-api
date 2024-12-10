const express = require('express');
const doctorsRouter = require('./routes/doctorsRouter');
const patientsRouter = require('./routes/patientsRouter');

const app = express();

// middlewares
app.use(express.json());

// routes
app.use('/api/v1/doctors', doctorsRouter);
app.use('/api/v1/patients', patientsRouter);

module.exports = app;
