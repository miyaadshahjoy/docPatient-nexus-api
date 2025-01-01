const express = require('express');

const doctorsController = require('./../controllers/doctorsController');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const Doctor = require('../models/doctorsModel');
const Admin = require('../models/adminsModel');

const router = express.Router('/api/v1/doctors');
router.post(
  '/signup',
  authController.protect(Admin),
  authController.restrictToAdmin,
  authController.signupDoctor
);
router.post('/signin', authController.signinDoctor);

router.post(
  '/forgotPassword',
  authController.protect(Doctor),
  authController.restrictToDoctor,
  authController.forgotPassword(Doctor)
);
router.post(
  '/resetPassword/:resetToken',
  authController.protect(Doctor),
  authController.restrictToDoctor,
  authController.resetPassword(Doctor)
);
router.get(
  '/verifyEmail/:verificationToken',
  authController.protect(Doctor),
  authController.verifyEmail
);

router.post(
  '/updatePassword',
  authController.protect(Doctor),
  authController.updatePassword(Doctor)
);
router.post(
  '/updateAccount',
  authController.protect(Doctor),
  userController.updateDoctorAccount
);
router.delete(
  '/deleteAccount',
  authController.protect(Doctor),
  userController.deleteDoctorAccount
);

router
  .route('/')
  .get(doctorsController.getAllDoctors)
  .post(doctorsController.addDoctor);
router
  .route('/:id')
  .get(doctorsController.getDoctor)
  .patch(doctorsController.updateDoctor)
  .delete(doctorsController.removeDoctor);

module.exports = router;
