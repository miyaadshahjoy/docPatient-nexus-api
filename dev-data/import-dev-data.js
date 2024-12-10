const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./../models/doctorsModel');
const Patient = require('./../models/patientsModel');
dotenv.config({
  path: './config.env',
});

const dbUri = process.env.DB_URI.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose.connect(dbUri).then(() => {
  console.log('Database Connected Successfully 🤩🤩');
});

const doctorsData = fs.readFileSync(
  `${__dirname}/data/doctors-data.json`,
  'utf-8'
);
const patientsData = fs.readFileSync(
  `${__dirname}/data/patients-data.json`,
  'utf-8'
);
const deleteDoctorsData = async function () {
  try {
    await Doctor.deleteMany();
    console.log('Data deleted successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deletePatientsData = async function () {
  try {
    await Patient.deleteMany();
    console.log('Data deleted successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const importDoctorsData = async function () {
  try {
    await Doctor.create(JSON.parse(doctorsData));

    console.log('Data imported successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const importPatientsData = async function () {
  try {
    await Patient.create(JSON.parse(patientsData));

    console.log('Data imported successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv.at(-1) === '--deleteDoc') {
  deleteDoctorsData();
} else if (process.argv.at(-1) === '--deletePat') {
  deletePatientsData();
} else if (process.argv.at(-1) === '--importDoc') {
  importDoctorsData();
} else if (process.argv.at(-1) === '--importPat') {
  importPatientsData();
}
