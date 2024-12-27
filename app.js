const express = require('express');
const cookieParser = require('cookie-parser');
const doctorsRouter = require('./routes/doctorsRouter');
const patientsRouter = require('./routes/patientsRouter');
const adminsRouter = require('./routes/adminsRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
// routes
app.use('/api/v1/doctors', doctorsRouter);
app.use('/api/v1/patients', patientsRouter);
app.use('/api/v1/admins', adminsRouter);

app.all('*', (req, res, next) => {
  /*
  res.status(404);
  res.json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this SERVER!`,
  });
  */
  next(new AppError(`Can't find ${req.originalUrl} on this SERVER!`, 404));
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
