const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Admin = require('./../models/adminsModel');
const Doctor = require('./../models/doctorsModel');
const Patient = require('./../models/patientsModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

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
/*
// Impl: clear user role from the cookies
const clearRoleFromCookie = function (res) {
  res.clearCookie('role');
};*/

// Impl: Email Verification
const sendEmailVerificationToken = async function (req, next, user) {
  // TODO: 1) Create email verification token
  const verificationToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });
  // TODO: 2) Store the token on DB
  // TODO: 3) Send verification Email
  const resource = `${user.role}s`;
  const verificationUrl = `${req.protocol}://${req.hostname}/api/v1/${resource}/verifyEmail/${verificationToken}`;
  const message = `To verify your email click on this link: ${verificationUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Email verification',
      message,
    });
  } catch (err) {
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpire = undefined;
    await user.save();
    return next(
      new AppError(
        'There was an error sending the email for Email Verification. Please try later!',
        400
      )
    );
  }
};

// Impl: Protect routes
exports.protect = function (Model) {
  return catchAsync(async (req, res, next) => {
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
    // TODO: 3) Check if user still exists
    const decodedDocument = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const currentUser = await Model.findById(decodedDocument.id);

    if (!currentUser)
      return next(
        new AppError(
          'The user belonging to this token does no longer exist',
          401
        )
      );
    // TODO: 4) Check if user changed password after the token was issued

    if (currentUser.passwordChangedAfter(decodedDocument.iat))
      return next(
        new AppError('User changed password recently. Please login again!', 401)
      );
    req.user = currentUser;
    next();
  });
};

// Impl: Authorization
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

    // TODO: send Email verification email
    sendEmailVerificationToken(req, next, user);
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
      return next(new AppError('Incorrect email or password', 401));
    // TODO: 3) If everything is ok, send token to client
    const token = signToken(user._id);
    // clearRoleFromCookie(res);

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

// Impl: Forgot Password
exports.forgotPassword = function (Model) {
  return catchAsync(async (req, res, next) => {
    // TODO: 1) Get user based on POSTed email
    const { email } = req.body;
    const currentUser = await Model.findOne({ email });
    if (!currentUser) {
      return next(new AppError('There is no user exist with this email', 401));
    }
    // TODO: 2) Generate the random reset token
    const resetToken = currentUser.createPasswordResetToken();
    await currentUser.save({ validateBeforeSave: false });
    // TODO: 3) Send it to user's email
    const resource =
      `${Model}`.slice(0, 1).toLocaleLowerCase() + `${Model}`.slice(1);
    const resetUrl = `${req.protocol}://${req.hostname}/api/v1/${resource}/resetPassword/${resetToken}`;
    const message = `Forgot password? Send a POST request with password and passwodConfirm to: ${resetUrl}\nIf you didn't forget your password, ignore this email`;

    try {
      await sendEmail({
        email: currentUser.email,
        subject: `Password reset token (Expires in 10 minutes)`,
        message,
      });
      res.status(200);
      res.json({
        status: 'Success',
        message: 'Token sent to email',
      });
    } catch (err) {
      currentUser.passwordResetToken = undefined;
      currentUser.passwordResetTokenExpire = undefined;
      await currentUser.save({ validateBeforeSave: false });
      return next(
        new AppError(
          'There was an error sending email. Please try again later!',
          500
        )
      );
    }
  });
};

// Impl: Reset Password

exports.resetPassword = function (Model) {
  return catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;
    const resetToken = req.params.resetToken;

    // TODO: 1) Get user based on the token
    const hashedResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const currentUser = await Model.findOne({
      passwordResetToken: hashedResetToken,
      passwordResetTokenExpire: { $gt: Date.now() },
    }).select('+password');

    if (!currentUser)
      return next(new AppError('Token is invalid or has expired', 400));
    if (
      !(await currentUser.correctPassword(
        currentPassword,
        currentUser.password
      ))
    )
      return next(new AppError('Incorrect current password', 400));

    // TODO: 2) If token has not expired, and there is user, set the new password
    currentUser.password = newPassword;
    currentUser.passwordConfirm = newPasswordConfirm;
    currentUser.passwordResetToken = undefined;
    currentUser.passwordResetTokenExpire = undefined;
    await currentUser.save();

    // TODO: 3) Update passwordChangedAt property for the user
    // TODO: 4) Log the user in, Send JWT
    const token = signToken(currentUser._id);
    res.status(200);
    res.json({
      status: 'success',
      token,
      data: {
        currentUser,
      },
    });
  });
};

// Impl: Verify email

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { verificationToken } = req.params;
  const currentUser = req.user;

  if (
    crypto.createHash('sha256').update(verificationToken).digest('hex') !==
    currentUser.emailVerificationToken
  )
    return next(new AppError('Token is invalid or has expired', 400));
  currentUser.emailVerified = true;
  await currentUser.save({
    validateBeforeSave: false,
  });
  const token = signToken(currentUser._id);
  res.status(200);
  res.json({
    status: 'success',
    token,
    message: 'Email is verified!',
    data: { user: currentUser },
  });
});

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
exports.restrictToPatient = restrict('patient');
