const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const adminsController = require('./../controllers/adminsController');
const Admin = require('../models/adminsModel');

const router = express.Router('/api/v1/admins');

router.post('/signup', authController.signupAdmin);
router.post('/signin', authController.signinAdmin);

router.use(authController.protect(Admin));
router.post(
  '/forgotPassword',
  authController.restrictToAdmin,
  authController.forgotPassword(Admin)
);
router.post(
  '/resetPassword/:resetToken',
  authController.restrictToAdmin,
  authController.resetPassword(Admin)
);
router.get('/verifyEmail/:verificationToken', authController.verifyEmail);
router.post('/updateAccount', userController.updateAdminAccount);
router.post('/updatePassword', authController.updatePassword(Admin));
router.delete('/deleteAccount', userController.deleteAdminAccount);

// Endpoint for approving a Doctor
router.patch('/approveDoctor/:doctorId', adminsController.approveDoctor);

module.exports = router;
