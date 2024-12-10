const { query } = require('express');
const Patient = require('./../models/patientsModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAllPatients = async (req, res) => {
  try {
    //   execute query
    const features = new APIFeatures(Patient.find(), req.query)
      .filter()
      .sort()
      .limitField()
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
  } catch (err) {
    res.status(404);
    res.json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getPatient = async (req, res) => {
  try {
    const id = req.params.id;
    const patient = await Patient.findById(id);
    res.status(200);
    res.json({
      status: 'success',
      data: {
        patient,
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

exports.addPatient = async (req, res) => {
  try {
    const newPatient = await Patient.create(req.body);
    res.status(201);
    res.json({
      status: 'success',
      data: {
        newPatient,
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

exports.updatePatient = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedPatient = await Patient.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200);
    res.json({
      status: 'success',
      data: {
        updatedPatient,
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

exports.removePatient = async (req, res) => {
  try {
    const id = req.params.id;
    await Patient.findByIdAndDelete(id);
    res.status(204);
    res.json({
      status: 'success',
    });
  } catch (err) {
    res.status(404);
    res.json({
      status: 'fail',
      message: err,
    });
  }
};
