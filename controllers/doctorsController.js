const { Query } = require('mongoose');
const Doctor = require('./../models/doctorsModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAllDoctors = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404);
    res.json({
      status: 'fail',
      message: err,
    });
  }
};

exports.addDoctor = async (req, res) => {
  try {
    const newDoctor = await Doctor.create(req.body);
    res.status(201);
    res.json({
      status: 'success',
      data: {
        newDoctor,
      },
    });
  } catch (err) {
    res.status(400);
    res.json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getDoctor = async (req, res) => {
  try {
    const id = req.params.id;
    const doctor = await Doctor.findById(id);
    res.status(200);
    res.json({
      status: 'success',
      data: {
        doctor,
      },
    });
  } catch (err) {
    res.status(404);
    res.json({
      status: 'fail',
      message: err,
    });
  }
};
exports.updateDoctor = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedDoctor = await Doctor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidator: true,
    });
    res.status(200);
    res.json({
      status: 'success',
      data: {
        updatedDoctor,
      },
    });
  } catch (err) {
    res.status(404);
    res.json({
      status: 'fail',
      message: err,
    });
  }
};
exports.removeDoctor = async (req, res) => {
  try {
    const id = req.params.id;
    await Doctor.findByIdAndDelete(id);
    res.status(204);
    res.json({
      status: 'success',
      message: 'content deleted successfully',
    });
  } catch (err) {
    res.status(404);
    res.json({
      status: 'fail',
      message: err,
    });
  }
};
