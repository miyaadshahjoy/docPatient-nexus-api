const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.readAllDocuments = (Model, filterOptions) => {
  return catchAsync(async (req, res, next) => {
    console.log(filterOptions);
    const feature = new APIFeatures(Model.find(filterOptions), req.query)
      .filter()
      .sort()
      .paginate()
      .limitFields();
    // Execute Query
    const doc = await feature.query;
    res.status(200);
    res.json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
};

exports.readDocument = (Model, populateOptions, filterOptions) => {
  return catchAsync(async (req, res, next) => {
    const id = req.params.id;
    let filter = { _id: id };
    filter = { ...filter, ...filterOptions };
    const doc = await Model.findOne(filter).populate(populateOptions);
    if (!doc) return next(new AppError('No document for this ID', 404));
    res.status(200);
    res.json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
};

exports.createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201);
    res.json({
      status: 'success',
      data: {
        newDoc,
      },
    });
  });
};

exports.updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const updatedDoc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedDoc) return next(new AppError('No document for this ID', 404));

    res.status(200);
    res.json({
      status: 'success',
      data: {
        updatedDoc,
      },
    });
  });
};

exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) return next(new AppError('No document for this ID', 404));

    res.status(204);
    res.json({
      status: 'success',
      message: 'content deleted successfully',
    });
  });
};
