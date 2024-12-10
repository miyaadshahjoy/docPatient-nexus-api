const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
  fullName: {
    type: String,
    unique: true,
    required: [true, 'a patient must have a name'],
  },
  email: {
    type: String,
    required: [true, 'a patient must have an email'],
  },
  phone: {
    type: String,
    required: [true, 'a patient must have a phone'],
  },
  profilePicture: String,
  gender: {
    type: String,
    required: [true, 'a patient must have a gender'],
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'a patient must have a date of birth'],
  },
  bloodGroup: {
    type: String,
    required: [true, 'a patient must have a blood group'],
  },
  allergies: [String],
  chronicConditions: [String],
  currentMedications: [String],
  familyHistory: [String],
  emergencyContact: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    relationship: {
      type: String,
      required: true,
    },
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
  },
  appointmentHistory: [
    {
      doctorId: String,
      date: Date,
      reason: String,
      prescription: String,
    },
  ],
  lastVisitDate: {
    type: Date,
    required: true,
  },
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
