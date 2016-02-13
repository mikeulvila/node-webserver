'use strict'

const mongoose = require('mongoose');

module.exports = mongoose.model('images', mongoose.Schema({
  link: String
}));
