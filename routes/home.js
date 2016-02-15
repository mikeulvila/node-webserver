'use strict'

const express = require('express');
const router = express.Router();

// bring in modules
const News = require('../models/News');

// get for index
router.get('/', (req, res) => {
  News.findOne().sort('-_id').exec((err, doc) => {
    if (err) throw err;

    const topStory = doc && doc.top && doc.top[0] || '';

    res.render('index', {
      date: new Date(),
      topStory: topStory
    });
  });
});


module.exports = router;
