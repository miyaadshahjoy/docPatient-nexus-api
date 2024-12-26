const express = require('express');
const patientsController = require('./../controllers/patientsController');
const authController = require('./../controllers/authController');
const router = express.Router('/api/v1/patients');

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
