const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) get tour data from collection
  const tours = await Tour.find();

  //2) Build temolate
  // 3) render template using the date from step 1
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});
exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  res.status(200).render('tour', {
    title: 'The Forest Hiker',
    tour,
  });
});
