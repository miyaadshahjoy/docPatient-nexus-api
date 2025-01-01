const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
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
router.post(
  '/updateAccount',
  authController.protect(Admin),
  userController.updateAdminAccount
);
router.post(
  '/updatePassword',
  authController.protect(Admin),
  authController.updatePassword(Admin)
);
router.delete(
  '/deleteAccount',
  authController.protect(Admin),
  userController.deleteAdminAccount
);
module.exports = router;
