const express = require('express');
const patientsController = require('./../controllers/patientsController');
const Patient = require('./../models/patientsModel');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const Doctor = require('../models/doctorsModel');
const Admin = require('../models/adminsModel');
const router = express.Router();

// Endpoints for Patients SIGNUP and SIGNIN
router.post('/signup', authController.signupPatient);
router.post('/signin', authController.signinPatient);

// Only a SIGNED IN Patient can access these Endpoints
router.use(authController.protect(Patient));
router.get('/verifyEmail/:verificationToken', authController.verifyEmail);

router.use(userController.restrictToAprovedUser);

router.post('/forgotPassword', authController.forgotPassword(Patient));
router.post(
  '/resetPassword/:resetToken',
  authController.resetPassword(Patient)
);

router.get('/currentUserAccount', userController.currentUserAccount(Patient));
router.post('/updatePassword', authController.updatePassword(Patient));
router.post('/updateAccount', userController.updatePatientAccount);
router.delete('/deleteAccount', userController.deletePatientAccount);

// Only an Admin can access these Endpoints
router
  .route('/')
  .get(
    authController.protect(Admin),
    authController.restrictToAdmin,
    patientsController.getAllPatients
  )
  .post(
    authController.protect(Admin),
    authController.restrictToAdmin,
    patientsController.addPatient
  );
router
  .route('/:id')
  .get(
    authController.protect(Admin),
    authController.restrictToAdmin,
    patientsController.getPatient
  )
  .patch(
    authController.protect(Admin),
    authController.restrictToAdmin,
    patientsController.updatePatient
  )
  .delete(
    authController.protect(Admin),
    authController.restrictToAdmin,
    patientsController.removePatient
  );
module.exports = router;
