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
const deleteData = async function () {
  try {
    await Doctor.deleteMany();
    await Patient.deleteMany();
    console.log('Data deleted successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const importData = async function () {
  try {
    await Doctor.create(JSON.parse(doctorsData));
    await Patient.create(JSON.parse(patientsData));
    console.log('Data imported successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv.at(-1) === '--delete') {
  deleteData();
} else if (process.argv.at(-1) === '--import') {
  importData();
}
