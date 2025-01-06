const { Query } = require('mongoose');
const Doctor = require('./../models/doctorsModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllDoctors = catchAsync(async (req, res, next) => {
  const feature = new APIFeatures(Doctor.find(), req.query)
    .filter()
    .sort()
    .paginate()
    .limitFields();
  // Execute Query
  const doctors = await feature.query;
  res.status(200);
  res.json({
    status: 'success',
    results: doctors.length,
    data: {
      doctors,
    },
  });
});

exports.addDoctor = catchAsync(async (req, res, next) => {
  const newDoctor = await Doctor.create(req.body);
  res.status(201);
  res.json({
    status: 'success',
    data: {
      newDoctor,
    },
  });
});

exports.getDoctor = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const doctor = await Doctor.findById(id)
    .populate({
      path: 'patients',
      select: 'fullName gender address',
    })
    .populate({
      path: 'appointments',
    });
  if (!doctor) return next(new AppError('No doctor for this ID', 404));
  res.status(200);
  res.json({
    status: 'success',
    data: {
      doctor,
    },
  });
});
exports.updateDoctor = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const updatedDoctor = await Doctor.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedDoctor) return next(new AppError('No doctor for this ID', 404));

  res.status(200);
  res.json({
    status: 'success',
    data: {
      updatedDoctor,
    },
  });
});
exports.removeDoctor = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const doctor = await Doctor.findByIdAndDelete(id);
  if (!doctor) return next(new AppError('No doctor for this ID', 404));

  res.status(204);
  res.json({
    status: 'success',
    message: 'content deleted successfully',
  });
});
