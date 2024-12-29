const express = require('express');
const patientsController = require('./../controllers/patientsController');
const Patient = require('./../models/patientsModel');
const authController = require('./../controllers/authController');
const Doctor = require('../models/doctorsModel');
const router = express.Router('/api/v1/patients');

router.post(
  '/signup',
  authController.protect(Doctor),
  authController.restrictToDoctor,
  authController.signupPatient
);
router.post('/signin', authController.signinPatient);
router.post(
  '/forgotPassword',
  authController.protect(Patient),
  authController.restrictToPatient,
  authController.forgotPassword(Patient)
);
router.post(
  '/resetPassword/:resetToken',
  authController.protect(Patient),
  authController.restrictToPatient,
  authController.resetPassword(Patient)
);
router.get(
  '/verifyEmail/:verificationToken',
  authController.protect(Patient),
  authController.verifyEmail
);
router.post(
  '/updatePassword',
  authController.protect(Patient),
  authController.updatePassword(Patient)
);

router.post(
  '/updateAccount',
  authController.protect(Patient),
  authController.updatePatientAccount
);

router.delete(
  '/deleteAccount',
  authController.protect(Patient),
  authController.deletePatientAccount
);
router
  .route('/')
  .get(authController.protect(Patient), patientsController.getAllPatients)
  .post(patientsController.addPatient);
router
  .route('/:id')
  .get(patientsController.getPatient)
  .patch(patientsController.updatePatient)
  .delete(patientsController.removePatient);

module.exports = router;
