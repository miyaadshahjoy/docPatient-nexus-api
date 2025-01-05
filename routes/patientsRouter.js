const express = require('express');
const patientsController = require('./../controllers/patientsController');
const Patient = require('./../models/patientsModel');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const Doctor = require('../models/doctorsModel');
const router = express.Router();

// express.Router({ mergeParams: true });

router.post('/signup', authController.signupPatient);
router.post('/signin', authController.signinPatient);
router.use(authController.protect(Patient));
router.post(
  '/forgotPassword',
  authController.restrictToPatient,
  authController.forgotPassword(Patient)
);
router.post(
  '/resetPassword/:resetToken',
  authController.restrictToPatient,
  authController.resetPassword(Patient)
);
router.get('/verifyEmail/:verificationToken', authController.verifyEmail);
router.post('/updatePassword', authController.updatePassword(Patient));

router.post('/updateAccount', userController.updatePatientAccount);

router.delete('/deleteAccount', userController.deletePatientAccount);

router
  .route('/')
  .get(patientsController.getAllPatients)
  .post(patientsController.addPatient);
router
  .route('/:id')
  .get(patientsController.getPatient)
  .patch(patientsController.updatePatient)
  .delete(patientsController.removePatient);

module.exports = router;
