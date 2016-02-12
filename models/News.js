'use strict';

const mongoose = require('mongoose');

module.exports = mongoose.model('news',
  mongoose.Schema({
    top: [{
      title: String,
      url: String
    }]
  }
));


