const express = require('express');

const doctorsController = require('./../controllers/doctorsController');
const authController = require('./../controllers/authController');

const router = express.Router('/api/v1/doctors');
router.post(
  '/signup',
  authController.protect,
  authController.restrictToAdmin,
  authController.signupDoctor
);
router.post('/signin', authController.signinDoctor);

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
