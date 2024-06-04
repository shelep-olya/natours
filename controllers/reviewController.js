const express = require('express');
const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catch-async');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});
exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.body.id);
  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const updatedReview = await Review.findByIdAndUpdate(req.body.id, req.body);
  res.status(204).json({
    status: 'success',
    data: {
      updatedReview,
    },
  });
});
exports.deleteReview = catchAsync(async (req, res, next) => {
  await Review.findByIdAndDelete(req.body.id);
  res.status(200).json({});
});
