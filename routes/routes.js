'use strict'

const express = require('express');
const router = express.Router();

const request = require('request');
const upload = multer({ storage: storage });
const _ = require('lodash');
const cheerio = require('cheerio');

// bring in modules
const AllCaps = require('../models/AllCaps');
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



router.get('/contact', (req, res) => {
  res.render('contact');
});


router.post('/contact', (req, res) => {
  // from Contact mongoose Schema
  const contactData = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });

  contactData.save((err, doc) => {
      if (err) throw err;

      console.log(doc);
      res.send(`<h1>Thanks for contacting us ${contactData.name}`);

  });

  // db.collection('contact').insertOne(contactData, (err, doc) => {
  //   console.log('doc', doc);
  //   if (err) throw err;

  //   res.send(`<h1>Thanks for contacting us ${contactData.name}`);

  // });
});

//UPLOAD PHOTO PAGE
router.get('/sendphoto', (req, res) => {
  res.render('sendphoto');
});

router.post('/sendphoto', upload.single('image'), function (req,res) {
  console.log(req.body, req.file);
  imgur.uploadFile(req.file.path)
    .then(function (json) {
        const imgurLink = json.data.link;
        db.collection('images').insertOne({link: imgurLink}, (err, doc) => {
          if (err) throw err;

          console.log('Saved Imgur link to database');
        });

        //delete the uploaded file from local storage
        fs.unlink(req.file.path, () => {
          console.log('Removed file from tmp/uploads.');
          res.send('<h1>Thansk for sending your photo');
        });
    })
    .catch(function (err) {
        console.error('IMGUR ERROR', err.message);
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

router.all('*', (req, res) => {
  res.status(403).send('Access Denied!');
});

module.exports = router;
