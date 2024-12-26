const jwt = require('jsonwebtoken');
const Doctor = require('./../models/doctorsModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// TODO: sign token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// TODO: Doctor signup
exports.signupDoctor = catchAsync(async (req, res, next) => {
  const newDoctor = await Doctor.create(req.body);

  const token = signToken(newDoctor._id);
  res.status(201);
  res.json({
    status: 'success',
    token,
    data: {
      doctor: newDoctor,
    },
  });
});

// TODO: Doctor signin
exports.signinDoctor = catchAsync(async (req, res, next) => {
  // TODO: 1) Check if email and passowrd exist
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));
  // TODO: 2) Check if doctor exists and password is correct
  const doctor = await Doctor.findOne({ email }).select('+password');
  if (!doctor || !(await doctor.correctPassword(password, doctor.password)))
    return next(new AppError('Incorrect email or password', 400));
  // TODO: 3) If everything onkeydown, send token to client
  const token = signToken(doctor._id);
  res.status(200);
  res.json({
    status: 'success',
    token,
    data: {
      doctor,
    },
  });
});

// TODO: Protect patient routes
exports.protect = catchAsync(async (req, res, next) => {
  // TODO: 1) Getting the JWT token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ').at(-1);
  }
  // TODO: 2) Verification of token
  if (!token)
    return next(new AppError('The token is invalid or has expired', 401));
  // TODO: 3) Check if doctor still exists
  const decodedDocument = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const currentDoctor = await Doctor.findById(decodedDocument.id);
  if (!currentDoctor)
    return next(
      new AppError(
        'The doctor belonging to this token does no longer exist',
        401
      )
    );
  // TODO: 4) Check if doctor changed password after the token was issued
  if (currentDoctor.passwordChangedAfter(decodedDocument.iat))
    return next(
      new AppError('Doctor changed password recently. Please login agai!', 401)
    );
  req.doctor = currentDoctor;
  next();
});
