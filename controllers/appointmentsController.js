const Appointment = require('./../models/appointmentsModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createAppointment = catchAsync(async (req, res, next) => {
  const newAppointment = await Appointment.create(req.body);

  res.status(201);
  res.json({
    status: 'success',
    data: {
      data: newAppointment,
    },
  });
});

exports.getAppointment = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const appointment = await Appointment.findById(id)
    .populate({
      path: 'patient',
      select: 'fullName gender address ',
    })
    .populate({
      path: 'doctor',
      select: 'fullName experience specialization averageRating',
    });

  res.status(200);
  res.json({
    status: 'success',
    data: {
      data: appointment,
    },
  });
});
