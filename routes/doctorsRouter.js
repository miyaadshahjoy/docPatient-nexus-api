const express = require('express');

const doctorsController = require('./../controllers/doctorsController');

const router = express.Router('/api/v1/doctors');

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
