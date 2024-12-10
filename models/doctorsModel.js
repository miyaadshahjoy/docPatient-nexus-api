const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({
  fullName: {
    type: String,
    unique: true,
    required: [true, 'a doctor must have a name'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'a doctor must have an email'],
  },
  phone: {
    type: String,
    unique: true,
    required: [true, 'a doctor must have a phone number'],
  },
  profilePicture: {
    type: String,
  },
  specialization: {
    type: [String],
    required: [true, 'a doctor must have an specialization'],
  },
  qualification: {
    type: [String],
    required: [true, 'a doctor must have a qualification'],
  },
  experience: {
    type: Number,
    required: [true, 'a doctor must have an experience '],
  },
  licenseNumber: {
    type: String,
  },
  clinicName: {
    type: String,
  },
  workAddres: {
    type: Object,
    required: [true, 'a doctor must have a working address'],
  },
  availibilitySchedule: {
    type: [Object],
  },
  appointmentDuration: {
    type: Number,
  },
  averageRating: {
    type: Number,
    default: 4.5,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  availibility: Boolean,
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
