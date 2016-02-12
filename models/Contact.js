'use strict';

const mongoose = require('mongoose');

module.exports = mongoose.model('contacts',
  mongoose.Schema({
    name: String,
    email: String,
    message: String
  }
));
