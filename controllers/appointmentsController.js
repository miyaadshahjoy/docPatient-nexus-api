const Appointment = require('./../models/appointmentsModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');
const Doctor = require('../models/doctorsModel');

exports.getAllAppointments = factory.readAllDocuments(Appointment);

exports.getAppointment = factory.readDocument(Appointment, [
  {
    path: 'patient',
    select: 'fullName gender address ',
  },
  {
    path: 'doctor',
    select: 'fullName experience specialization averageRating',
  },
]);
exports.getDoctorPatientIds = (req, res, next) => {
  req.body.doctor = req.params.doctorId;
  req.body.patient = req.user.id;
  next();
};

// Get available time slots for a doctor on a given day
exports.getAvailableTimeSlots = catchAsync(async (req, res, next) => {
  // Input: Doctor ID and the target date.
  let targetDate;
  if (req.body.appointmentDate) {
    targetDate = new Date(req.body.appointmentDate);
  } else {
    targetDate = new Date(req.body.date);
  }
  const currentDay = new Date();
  targetDate.setHours(0, 0, 0, 0);
  currentDay.setHours(0, 0, 0, 0);
  if (targetDate < currentDay)
    return next(new AppError('Please enter a valid date', 400));
  const doctor = await Doctor.findById(req.params.doctorId);
  if (!doctor)
    return next(new AppError('There is no Doctor for that Id😞😞', 400));
  const givenDay = targetDate.getDay();
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];
  // Step 1: Fetch the doctor's working hours for the given day.
  //     Call the database to retrieve the doctor's availability schedule for the specified day.
  const availibilitySchedule = doctor.availibilitySchedule.find(
    (ob) => ob.day === days[givenDay]
  );
  if (!availibilitySchedule)
    return next(new AppError('Doctor is not available today😅'));
  console.log(
    `Available on: ${availibilitySchedule.day}. From: ${availibilitySchedule.time}`,
    availibilitySchedule
  );
  // Step 2: Fetch booked appointments for the given day.
  //     Query the database for appointments associated with the doctor on the specified date.

  const bookedAppointments = await Appointment.find({
    doctor: doctor._id,
    appointmentDate: {
      $gte: targetDate.setHours(0, 0, 0, 0), // start of the day
      $lt: targetDate.setHours(23, 59, 59, 999), // end of the day
    },
  });

  // Step 3: Generate all possible time slots.
  //     Calculate the time slots from the start to the end of the working hours based on the doctor’s appointment duration (e.g., 1 hour).

  const { appointmentDuration } = doctor;

  let [startingHour, finishingHour] = availibilitySchedule.time
    .split('-')
    .map((str) => Number.parseInt(str));

  finishingHour =
    finishingHour < startingHour ? finishingHour + 12 : finishingHour;
  const durationInHours = appointmentDuration / 60; // duration in hours
  const timeSlots = [];
  let s = startingHour;
  let f = startingHour + durationInHours;
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth();
  const targetDay = targetDate.getDate();

  while (f <= finishingHour) {
    const startTime = new Date(targetYear, targetMonth, targetDay, s + 6, 0, 0);
    const finishTime = new Date(
      targetYear,
      targetMonth,
      targetDay,
      f + 6,
      0,
      0
    );

    timeSlots.push({
      startTime,
      finishTime,
    });
    s = f;
    f = f + durationInHours;
  }

  // Step 4: Filter out booked time slots.
  //     Compare each generated time slot with the list of booked appointments and remove any overlapping slots.

  const bookedDates = bookedAppointments.map((appmnt) =>
    appmnt.appointmentDate.getTime()
  );

  const availableTimeSlots = timeSlots.filter((slot) => {
    return !bookedDates.includes(slot.startTime.getTime());
  });

  // Step 5: Return the available time slots.
  //     Provide the list of slots that are free for booking.
  //
  req.availableTimeSlots = availableTimeSlots;
  next();
  /*
  res.status(200);
  res.json({
    status: 'success',
    results: availableTimeSlots.length,
    data: {
      availableTimeSlots,
    },
  });*/
});

exports.checkTimeSlot = (req, res, next) => {
  // Check if the appointmentDate is valid or not
  const appointmentDate = new Date(req.body.appointmentDate).getTime();
  // Get Available Time Slots

  const availableTimeSlots = req.availableTimeSlots.map((slot) =>
    slot.startTime.getTime()
  );

  if (!availableTimeSlots.includes(appointmentDate))
    return next(
      new AppError('This time slot is not available for booking🧾', 400)
    );
  next();
};

exports.bookAppointment = factory.createOne(Appointment);
exports.updateAppointment = factory.updateOne(Appointment);
exports.deleteAppointment = factory.deleteOne(Appointment);
