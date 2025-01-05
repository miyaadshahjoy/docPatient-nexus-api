const catchAsync = require('../utils/catchAsync');
const Doctor = require('./../models/doctorsModel');
const AppError = require('./../utils/appError');

exports.approveDoctor = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findByIdAndUpdate(
    req.params.doctorId,
    {
      approved: true,
    },
    { new: true, runValidators: true }
  );

  if (!doctor) return next(new AppError('No doctor with this Id🚫🚫', 404));
  res.status(200);
  res.json({
    status: 'success',
    message: 'Doctor account approved successfully',
    data: {
      doctor,
    },
  });
});
