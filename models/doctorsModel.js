const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const instanceMethodsPlugin = require('../utils/instanceMethodsPlugin');
const passwordEncryption = require('./../utils/passwordEncryption');
const passwordChangedAtModify = require('../utils/passwordChangedAtModify');
const { patientSchema } = require('./patientsModel');

const doctorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    unique: true, // The unique Option is Not a Validator
    required: [true, 'a doctor must have a name'],
    minlength: [10, 'Name should have atleast 10 characters'],
    maxlength: [30, 'A name should not have more than 30 characters'],
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
  workAddress: {
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
    min: [1.0, 'Rating must be at least 1.0 or greater'],
    max: [5.0, 'Rating must not be more than 5.0'],
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  availibility: Boolean,
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must have atleast 8 characters'],
    select: false, // FIXME: password is still showing
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password confirm is required'],
    validate: {
      // This only works on CREATE and SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same🚫🚫',
    },
  },
  role: {
    type: String,
    default: 'doctor',
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpire: Date,
  emailVerificationToken: String,
  emailVerificationTokenExpire: Date,
  emailVerified: {
    type: Boolean,
    default: false,
  },
});

// middlewares
doctorSchema.pre('save', passwordEncryption);

// Instance methods
doctorSchema.plugin(instanceMethodsPlugin);
doctorSchema.pre('save', passwordChangedAtModify);

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
