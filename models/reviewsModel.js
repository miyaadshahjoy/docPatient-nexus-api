const mongoose = require('mongoose');
const Doctor = require('./../models/doctorsModel');
const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: 'Patient',
    required: true,
  },
  appointment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Appointment',
    required: true,
  },
});

// indexes
reviewSchema.index({ doctor: 1, patient: 1, appointment: 1 }, { unique: true });

// static methods
reviewSchema.statics.calculateAverageRatings = async function (doctorId) {
  const reviewStats = await this.aggregate([
    {
      $match: { doctor: doctorId },
    },
    {
      $group: {
        _id: '$doctor',
        nRatings: { $sum: 1 },
        avgRatings: { $avg: '$rating' },
      },
    },
  ]);
  if (reviewStats.length > 0) {
    await Doctor.findByIdAndUpdate(doctorId, {
      reviewsCount: reviewStats.at(0).nRatings,
      averageRating: reviewStats.at(0).avgRatings,
    });
  } else {
    await Doctor.findByIdAndUpdate(doctorId, {
      reviewsCount: 0,
      averageRating: 4.5,
    });
  }
};

// Document middlewares
reviewSchema.post('save', function () {
  // this points to the current document
  this.constructor.calculateAverageRatings(this.doctor);
});

// Query middlewares
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calculateAverageRatings(this.r.doctor);
});
// Review Model
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
