const { query } = require('express');
const Patient = require('./../models/patientsModel');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./../controllers/handlerFactory');

exports.getAllPatients = factory.readAllDocuments(Patient);

exports.getPatient = factory.readDocument(Patient, [
  {
    path: 'doctors',
    select: 'fullName specialization experience averageRating availibility',
  },
  {
    path: 'appointments',
  },
]);

exports.addPatient = factory.createOne(Patient);

exports.updatePatient = factory.updateOne(Patient);

exports.removePatient = factory.deleteOne(Patient);
