'use strict'

const express = require('express');
const router = express.Router();




// bring in modules
const Contact = require('../models/Contact');
const News = require('../models/News');

// get for index
router.get('/', (req, res) => {
  News.findOne().sort('-_id').exec((err, doc) => {

    if (err) throw err;
    res.render('index', {
      date: new Date(),
      topHeadline: doc.top[0]
    });

  });

});








router.get('/hello', (req, res) => {
  const name = req.query.name;

  const msg = `<h1>Hello ${name}!</h1>`;

    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    // chunk response by character
    msg.split('').forEach((char, i) => {
      setTimeout(() => {
        res.write(char);
      }, 1000*i);
    });
    // wait for all characters to be sent
    setTimeout(() => {
      res.end();
    }, 20000);
});

router.get('/cal/:month/:year', (req, res) => {
  const monthJS = require('node-cal/lib/month');
  var month = parseInt(req.params.month);
  var year = parseInt(req.params.year);
  res.end(`${monthJS.monthToString(month, year)}`);
});

router.get('/random/:min/:max', (req, res) => {
  var min = parseInt(req.params.min);
  var max = parseInt(req.params.max);
  console.log(min);
  console.log(max);
  res.end((Math.floor(Math.random() * (max - min + 1)) + min).toString());
});

module.exports = router;
