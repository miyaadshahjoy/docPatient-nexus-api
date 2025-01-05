const { query } = require('express');
const Patient = require('./../models/patientsModel');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllPatients = catchAsync(async (req, res, next) => {
  //   execute query
  const features = new APIFeatures(Patient.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const patients = await features.query;
  res.status(200);
  res.json({
    status: 'success',
    results: patients.length,
    data: {
      patients,
    },
  });
});

exports.getPatient = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const patient = await Patient.findById(id)
    .populate({
      path: 'doctors',
      select: 'fullName specialization experience averageRating availibility',
    })
    .populate('appointments');
  if (!patient) return next(new AppError('No patient for this ID', 404));

  res.status(200);
  res.json({
    status: 'success',
    data: {
      patient,
    },
  });
});

exports.addPatient = catchAsync(async (req, res, next) => {
  const newPatient = await Patient.create(req.body);
  res.status(201);
  res.json({
    status: 'success',
    data: {
      newPatient,
    },
  });
});

exports.updatePatient = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const updatedPatient = await Patient.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedPatient) return next(new AppError('No patient for this ID', 404));

  res.status(200);
  res.json({
    status: 'success',
    data: {
      updatedPatient,
    },
  });
});

exports.removePatient = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const patient = await Patient.findByIdAndDelete(id);
  if (!patient) return next(new AppError('No patient for this ID', 404));

  res.status(204);
  res.json({
    status: 'success',
  });
});
