const express = require('express');
const doctorsController = require('./../controllers/doctorsController');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const appointmentsRouter = require('./../routes/appointmentsRouter');
const Doctor = require('../models/doctorsModel');
const Admin = require('../models/adminsModel');

const router = express.Router();

router.use('/:doctorId/appointments', appointmentsRouter);
// Only admins can access these Endpoints
router
  .route('/')
  .get(doctorsController.getAllDoctors)
  .post(
    authController.protect(Admin),
    authController.restrictToAdmin,
    doctorsController.addDoctor
  );
router
  .route('/:id')
  .get(doctorsController.getDoctor)
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
router.get('/verifyEmail/:verificationToken', authController.verifyEmail);

router.use(userController.restrictToAprovedUser);

router.post('/forgotPassword', authController.forgotPassword(Doctor));
router.post('/resetPassword/:resetToken', authController.resetPassword(Doctor));

router.get('/currentUserAccount', userController.currentUserAccount(Doctor));
router.post('/updatePassword', authController.updatePassword(Doctor));
router.post('/updateAccount', userController.updateDoctorAccount);
router.delete('/deleteAccount', userController.deleteDoctorAccount);

module.exports = router;
