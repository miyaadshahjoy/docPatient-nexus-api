const jwt = require('jsonwebtoken');
const Admin = require('./../models/adminsModel');
const Doctor = require('./../models/doctorsModel');
const Patient = require('./../models/patientsModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// Impl: sign token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Impl: store user role on cookies
const storeRoleOnCookie = function (role, res) {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('role', role, cookieOptions);
};

// Impl: Protect routes
exports.protect = catchAsync(async (req, res, next) => {
  // TODO: 1) Getting the JWT token and check if it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ').at(-1);
  }
  // Getting role from cookies
  const role = req.cookies.role;

  // TODO: 2) Verification of token
  if (!token)
    return next(new AppError('The token is invalid or has expired', 401));
  // TODO: 3) Check if doctor still exists
  const decodedDocument = jwt.verify(token, process.env.JWT_SECRET_KEY);
  let currentUser;
  if (role === 'admin') {
    currentUser = await Admin.findById(decodedDocument.id);
  } else if (role === 'doctor') {
    currentUser = await Doctor.findById(decodedDocument.id);
  } else if (role === 'patient') {
    currentUser = await Patient.findById(decodedDocument.id);
  }

  if (!currentUser)
    return next(
      new AppError(
        'The doctor belonging to this token does no longer exist',
        401
      )
    );
  // TODO: 4) Check if doctor changed password after the token was issued
  if (currentUser.passwordChangedAfter(decodedDocument.iat))
    return next(
      new AppError('Doctor changed password recently. Please login again!', 401)
    );
  req.user = currentUser;
  next();
});

// Impl: Admin authorization
const restrict = function (role) {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (userRole !== role)
      return next(
        new AppError(`You are not authorized to perform this action`, 403)
      );
    next();
  };
};

// Impl: SIGN UP Handler
const signup = function (Model) {
  return catchAsync(async (req, res, next) => {
    const user = await Model.create(req.body);

    const token = signToken(user._id);
    storeRoleOnCookie(user.role, res);
    res.status(201);
    res.json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  });
};

// Impl: SIGN IN Handler
const signin = function (Model) {
  return catchAsync(async (req, res, next) => {
    // TODO: 1) Check if email and password exist
    const { email, password } = req.body;
    if (!email || !password)
      return next(new AppError('Please provide email and password', 400));
    // TODO: 2) Check if admin exists and password is correct
    const user = await Model.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password)))
      return next(new AppError('Incorrect email or password', 400));
    // TODO: 3) If everything is ok, send token to client
    const token = signToken(user._id);
    storeRoleOnCookie(user.role, res);

    res.status(200);
    res.json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  });
};

// SIGN UP
exports.signupAdmin = signup(Admin);
exports.signupDoctor = signup(Doctor);
exports.signupPatient = signup(Patient);

// SIGN IN
exports.signinAdmin = signin(Admin);
exports.signinDoctor = signin(Doctor);
exports.signinPatient = signin(Patient);

// AUTHORIZE
exports.restrictToAdmin = restrict('admin');
exports.restrictToDoctor = restrict('doctor');
