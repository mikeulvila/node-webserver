'use strict';

const mongoose = require('mongoose');

module.exports = mongoose.model('allcaps',
  mongoose.Schema({}, {
  //options to take anything
  strict: false
  }
));
