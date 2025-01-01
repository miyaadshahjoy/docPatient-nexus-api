const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const doctorsRouter = require('./routes/doctorsRouter');
const patientsRouter = require('./routes/patientsRouter');
const adminsRouter = require('./routes/adminsRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Global middlewares

// Setting up security Http headers
app.use(helmet());

// Body parser, reading data from body into req.body
app.use(express.json());

// Cookie parser, extract data stored in a cookie
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'reviewsCount',
      'bloodGroup',
      'averageRating',
      'experience',
      'specialization',
    ],
  })
);

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
