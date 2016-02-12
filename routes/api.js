'use strict'

const express = require('express');
const router = express.Router();

const request = require('request');
const _ = require('lodash');
const cheerio = require('cheerio');

// models
const News = require('../models/News');
const AllCaps = require('../models/AllCaps');

//sending json data
router.get('/api', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send({ hello: 'world' });
})

//post data to an api
router.post('/api', (req, res) => {
  const obj = _.mapValues(req.body, (val) => val.toUpperCase());

  AllCaps.create(obj, (err, _caps) => {
    if (err) throw err;

    console.log(_caps);
    res.send(_caps);
  });
});

//make a third party api request
router.get('/api/weather', (req, res) => {
  const url = 'https://api.forecast.io/forecast/0a240dea0feab43866d24f9adb42399a/37.8267,-122.423';
  request.get(url, (err, response, body) => {
    if (err) throw err;
    res.header('Access-Control-Allow-Origin', '*');
    res.send(JSON.parse(body));
  });
});

// WEB SCRAPING and add news to database
router.get('/api/news', (req, res) => {
  News.findOne().sort('-_id').exec((err, doc) => {

    console.log(doc._id.getTimestamp());

    if (doc) {
      const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
      const diff = new Date() - doc._id.getTimestamp() - FIFTEEN_MINUTES_IN_MS;
      const lessThan15MinutesAgo = diff < 0;

      if (lessThan15MinutesAgo) {
        res.send(doc);
        return;
      }
    }

    const url = 'http://cnn.com';

    request.get(url, (err, response, html) => {
      if (err) throw err;

      const news = [];
      const $ = cheerio.load(html);

      const $bannerText = $('.banner-text');

      news.push({
        title: $bannerText.text(),
        url: url + $bannerText.closest('a').attr('href')
      });

      const $cdHeadline = $('.cd__headline');

      _.range(1, 12).forEach(i => {
        const $headline = $cdHeadline.eq(i);

        news.push({
          title: $headline.text(),
          url: url + $headline.find('a').attr('href')
        });
      });

      const obj = new News({top: news});

       obj.save((err, newNews) => {
        if (err) throw err;

        res.send(newNews);
      });
    });
  });
});

module.exports = router;
