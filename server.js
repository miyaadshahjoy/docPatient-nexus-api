const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Catching uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down.....');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({
  path: './config.env',
});

// console.log(process.env);

const dbUri = process.env.DB_URI.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose.connect(dbUri).then(() => {
  console.log('Database Connected Successfully 🤩🤩');
});

const app = require('./app');

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

// Handling Unhandled Rejections

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down....');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
