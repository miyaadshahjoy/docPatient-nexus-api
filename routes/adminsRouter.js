const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const adminsController = require('./../controllers/adminsController');
const Admin = require('../models/adminsModel');
const Doctor = require('./../models/doctorsModel');
const Patient = require('./../models/patientsModel');

const router = express.Router('/api/v1/admins');

router.post('/signup', authController.signupAdmin);
router.post('/signin', authController.signinAdmin);

router.use(authController.protect(Admin));
router.get('/verifyEmail/:verificationToken', authController.verifyEmail);

router.post('/forgotPassword', authController.forgotPassword(Admin));
router.post('/resetPassword/:resetToken', authController.resetPassword(Admin));

router.get('/currentUserAccount', userController.currentUserAccount(Admin));
router.post('/updateAccount', userController.updateAdminAccount);
router.post('/updatePassword', authController.updatePassword(Admin));
router.delete('/deleteAccount', userController.deleteAdminAccount);

// Endpoint for approving a Doctor
router.patch('/approveDoctor/:id', adminsController.approveUser(Doctor));
router.patch('/approvePatient/:id', adminsController.approveUser(Patient));
module.exports = router;
