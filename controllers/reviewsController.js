const Review = require('./../models/reviewsModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');

exports.getAllReviews = factory.readAllDocuments(Review);
exports.getReview = factory.readDocument(Review);

exports.getDoctorPatientAppointmentIds = (req, res, next) => {
  req.body.doctor = req.params.doctorId;
  req.body.patient = req.user.id;
  req.body.appointment = req.params.appointId;
};
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
