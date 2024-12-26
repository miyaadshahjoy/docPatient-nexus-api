const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
  passwordChangedAt: Date,
});

// middlewares
doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // TODO: Encrypt the password
  const encryptedPassword = await bcrypt.hash(this.password, 12);
  this.password = encryptedPassword;
  // TODO: Delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// Instance methods
doctorSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

doctorSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
  return JWTTimestamp < this.passwordChangedAt.getTime() / 1000;
};
const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
