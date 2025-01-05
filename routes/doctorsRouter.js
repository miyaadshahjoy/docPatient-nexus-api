const express = require('express');

const doctorsController = require('./../controllers/doctorsController');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const patientsRouter = require('./../routes/patientsRouter');
const Doctor = require('../models/doctorsModel');
const Admin = require('../models/adminsModel');

const router = express.Router();

// Only admins can access these Endpoints
router
  .route('/')
  .get(
    authController.protect(Admin),
    authController.restrictToAdmin,
    doctorsController.getAllDoctors
  )
  .post(
    authController.protect(Admin),
    authController.restrictToAdmin,
    doctorsController.addDoctor
  );
router
  .route('/:id')
  .get(
    authController.protect(Admin),
    authController.restrictToAdmin,
    doctorsController.getDoctor
  )
  .patch(
    authController.protect(Admin),
    authController.restrictToAdmin,
    doctorsController.updateDoctor
  )
  .delete(
    authController.protect(Admin),
    authController.restrictToAdmin,
    doctorsController.removeDoctor
  );

// Endpoints for Doctors SIGNIN and SIGNUP
router.post('/signup', authController.signupDoctor);
router.post('/signin', authController.signinDoctor);

// Only a SIGNED IN Doctor can access these Endpoints
router.use(authController.protect(Doctor));
router.get('/verifyEmail/:verificationToken', authController.verifyEmail);

router.use(doctorsController.restrictToAprovedDoctor);

router.post('/forgotPassword', authController.forgotPassword(Doctor));
router.post('/resetPassword/:resetToken', authController.resetPassword(Doctor));

router.post('/updatePassword', authController.updatePassword(Doctor));
router.post('/updateAccount', userController.updateDoctorAccount);
router.delete('/deleteAccount', userController.deleteDoctorAccount);

module.exports = router;
