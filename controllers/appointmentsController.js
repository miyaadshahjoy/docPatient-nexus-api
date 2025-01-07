const Appointment = require('./../models/appointmentsModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');

exports.getAllAppointments = factory.readAllDocuments(Appointment);

exports.getAppointment = factory.readDocument(Appointment, [
  {
    path: 'patient',
    select: 'fullName gender address ',
  },
  {
    path: 'doctor',
    select: 'fullName experience specialization averageRating',
  },
]);
exports.getDoctorPatientIds = (req, res, next) => {
  req.body.doctor = req.params.doctorId;
  req.body.patient = req.user.id;
};
exports.createAppointment = factory.createOne(Appointment);
exports.updateAppointment = factory.updateOne(Appointment);
exports.deleteAppointment = factory.deleteOne(Appointment);
