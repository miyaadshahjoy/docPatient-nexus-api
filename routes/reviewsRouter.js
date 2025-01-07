const express = require('express');
const reviewsController = require('./../controllers/reviewsController');
const authController = require('./../controllers/authController');
// const Patient = require('./../models/patientsModel');
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(authController.restrictToAdmin, reviewsController.getAllReviews)
  .post(
    authController.restrictToPatient,
    reviewsController.getDoctorPatientAppointmentIds,
    reviewsController.createReview
  );

router
  .route('/:id')
  .get(reviewsController.getReview)
  .patch(reviewsController.updateReview)
  .delete(reviewsController.deleteReview);

module.exports = router;
