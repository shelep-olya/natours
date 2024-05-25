const fs = require('fs');
const Tour = require('./../../models/tourModel');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

exports.importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data loaded');
  } catch (err) {
    console.log(err);
  }
};

exports.deleteAllData = async () => {
  try {
    await Tour.deleteMany();
    console.log('deleted successfully');
  } catch (err) {
    console.log(err);
  }
};
