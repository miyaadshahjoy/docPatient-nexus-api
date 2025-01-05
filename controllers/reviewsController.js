const Review = require('./../models/reviewsModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createReview = catchAsync(async (req, res, next) => {
  req.body.appointment = req.params.appointId;
  const newReview = await Review.create(req.body);

  res.status(201);
  res.json({
    status: 'successful',
    data: {
      data: newReview,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findOne({ appointment: req.params.appointId });

  res.status(200);
  res.json({
    status: 'success',
    data: {
      data: review,
    },
  });
});
