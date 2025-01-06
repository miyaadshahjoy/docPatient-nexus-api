const express = require('express');
const reviewsController = require('./../controllers/reviewsController');
const authController = require('./../controllers/authController');
const Patient = require('./../models/patientsModel');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authController.protect(Patient),
    authController.restrictToPatient,
    reviewsController.createReview
  )
  .get(reviewsController.getReview);

module.exports = router;
