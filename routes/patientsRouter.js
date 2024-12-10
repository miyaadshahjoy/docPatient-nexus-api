const express = require('express');
const patientsController = require('./../controllers/patientsController');
const router = express.Router('/api/v1/patients');

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
