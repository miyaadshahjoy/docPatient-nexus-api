const express = require('express');
const reviewsController = require('./../controllers/reviewsController');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(reviewsController.createReview)
  .get(reviewsController.getReview);

module.exports = router;
