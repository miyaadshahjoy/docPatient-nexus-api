const mongoose = require('mongoose');
const validator = require('validator');
const instanceMethodsPlugin = require('../utils/instanceMethodsPlugin');
const passwordEncryption = require('../utils/passwordEncryption');
const passwordChangedAtModify = require('./../utils/passwordChangedAtModify');

const patientSchema = mongoose.Schema({
  fullName: {
    type: String,
    unique: true, // The unique Option is Not a Validator
    required: [true, 'a patient must have a name'],
  },
  email: {
    type: String,
    required: [true, 'a patient must have an email'],
    validate: [validator.isEmail, 'Provide a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'a patient must have a phone'],
  },
  profilePicture: String,
  gender: {
    type: String,
    required: [true, 'a patient must have a gender'],
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'a patient must have a date of birth'],
  },
  bloodGroup: {
    type: String,
    required: [true, 'a patient must have a blood group'],
  },
  allergies: [String],
  chronicConditions: [String],
  currentMedications: [String],
  familyHistory: [String],
  emergencyContact: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    relationship: {
      type: String,
      required: true,
    },
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
  },
  appointmentHistory: [
    {
      doctorId: String,
      date: Date,
      reason: String,
      prescription: String,
    },
  ],
  lastVisitDate: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must contain atleast 8 characters.'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not same...🚫🚫',
    },
  },
  role: {
    type: String,
    default: 'patient',
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
  active: {
    type: Boolean,
    default: true,
  },
});
exports.patientSchema = patientSchema;

// middlewares
patientSchema.pre('save', passwordEncryption);
patientSchema.pre('save', passwordChangedAtModify);

// Instance methods
patientSchema.plugin(instanceMethodsPlugin);

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
