const Doctor = require('./../models/doctorsModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./../controllers/handlerFactory');
exports.getAllDoctors = factory.readAllDocuments(Doctor);
exports.getDoctor = factory.readDocument(Doctor, [
  {
    path: 'patients',
    select: 'fullName gender address',
  },
  {
    path: 'appointments',
  },
]);

exports.addDoctor = factory.createOne(Doctor);
exports.updateDoctor = factory.updateOne(Doctor);
exports.removeDoctor = factory.deleteOne(Doctor);
