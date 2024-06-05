const mongoose = require('mongoose');
const Tour = require('./tourModel');
const User = require('./userModel');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must have an author'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'author',
  //   select: 'name photo',
  // }).populate({
  //   path: 'tour',
  //   select: 'name',
  // });
  // next();
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: {
          $sum: 1,
        },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
};

reviewSchema.pre('save', function (next) {
  this.constructor.calcAverageRatings(this.tour);
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
