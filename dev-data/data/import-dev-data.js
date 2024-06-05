const fs = require('fs');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

exports.importData = async () => {
  try {
    await User.create(users);
    console.log('data loaded');
  } catch (err) {
    console.log(err);
  }
};

exports.deleteAllData = async () => {
  try {
    await User.deleteMany();
    console.log('deleted successfully');
  } catch (err) {
    console.log(err);
  }
};
