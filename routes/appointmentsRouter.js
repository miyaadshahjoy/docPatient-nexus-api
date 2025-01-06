const express = require('express');
const reviewsRouter = require('./../routes/reviewsRouter');
const authController = require('./../controllers/authController');
const appointmentsController = require('./../controllers/appointmentsController');
const Patient = require('../models/patientsModel');
const router = express.Router({ mergeParams: true });

router.use('/:appointId/reviews', reviewsRouter);

router
  .route('/')
  .post(
    authController.protect(Patient),
    authController.restrictToPatient,
    appointmentsController.createAppointment
  );

router.route('/:id').get(appointmentsController.getAppointment);
module.exports = router;
