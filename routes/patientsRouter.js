const express = require('express');
const patientsController = require('./../controllers/patientsController');
const authController = require('./../controllers/authController');
const router = express.Router('/api/v1/patients');

router.post(
  '/signup',
  authController.protect,
  authController.restrictToDoctor,
  authController.signupPatient
);
router.post('/signin', authController.signinPatient);

router
  .route('/')
  .get(authController.protect, patientsController.getAllPatients)
  .post(patientsController.addPatient);
router
  .route('/:id')
  .get(patientsController.getPatient)
  .patch(patientsController.updatePatient)
  .delete(patientsController.removePatient);

module.exports = router;
