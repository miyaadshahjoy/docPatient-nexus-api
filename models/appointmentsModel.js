const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Doctor', // Parent referencing
    required: true,
  },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: 'Patient', // Parent referencing
    required: true,
  },
  appointmentDate: {
    type: Date,
  },
  reason: String,
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    defualt: 'confirmed',
  },
  paymentAmount: Number,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  paymentMethod: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
});

// Appointment Model
const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
