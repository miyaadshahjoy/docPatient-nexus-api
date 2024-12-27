const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const instanceMethodsPlugin = require('../utils/instanceMethodsPlugin');
const passwordEncryption = require('../utils/passwordEncryption');

// TODO: Admin Schema
const adminSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'Admin must have a name'],
  },
  email: {
    type: String,
    required: [true, 'Admin must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must contain atleast 8 characters!'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same...🚫🚫',
    },
  },
  passwordChangedAt: Date,
  role: {
    type: String,
    required: true,
    default: 'admin',
  },
});

// middlewares
adminSchema.pre('save', passwordEncryption);

// Instance methods
adminSchema.plugin(instanceMethodsPlugin);

// Admin Model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
