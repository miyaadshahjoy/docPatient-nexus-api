const express = require('express');
const reviewsRouter = require('./../routes/reviewsRouter');
const authController = require('./../controllers/authController');
const appointmentsController = require('./../controllers/appointmentsController');

const router = express.Router({ mergeParams: true });

router.use('/:appointId/reviews', reviewsRouter);

router.use(authController.protect);

router
  .route('/')
  .post(
    authController.restrictToPatient,
    appointmentsController.getDoctorPatientIds,
    appointmentsController.createAppointment
  )
  .get(
    authController.restrictToAdmin,
    appointmentsController.getAllAppointments
  );

router
  .route('/:id')
  .get(authController.restrictToAdmin, appointmentsController.getAppointment)
  .patch(
    authController.restrictToAdmin,
    appointmentsController.updateAppointment
  )
  .delete(
    authController.restrictToAdmin,
    appointmentsController.deleteAppointment
  );
module.exports = router;
