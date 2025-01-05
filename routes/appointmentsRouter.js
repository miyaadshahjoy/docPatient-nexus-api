const express = require('express');
const reviewsRouter = require('./../routes/reviewsRouter');
const appointmentsController = require('./../controllers/appointmentsController');
const router = express.Router();

router.use('/:appointId/reviews', reviewsRouter);

router.route('/').post(appointmentsController.createAppointment);

router.route('/:id').get(appointmentsController.getAppointment);
module.exports = router;
