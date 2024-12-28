const express = require('express');
const authController = require('./../controllers/authController');
const Admin = require('../models/adminsModel');

const router = express.Router('/api/v1/admins');

router.post('/signup', authController.signupAdmin);
router.post('/signin', authController.signinAdmin);

router.post(
  '/forgotPassword',
  authController.protect(Admin),
  authController.restrictToAdmin,
  authController.forgotPassword(Admin)
);
router.post(
  '/resetPassword/:resetToken',
  authController.protect(Admin),
  authController.restrictToAdmin,
  authController.resetPassword(Admin)
);
router.get(
  '/verifyEmail/:verificationToken',
  authController.protect(Admin),
  authController.verifyEmail
);

module.exports = router;
