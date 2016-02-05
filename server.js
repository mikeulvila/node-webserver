'use strict'
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const request = require('request');
const bodyParser = require('body-parser');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
const imgur = require('imgur');
const _ = require('lodash');
const cheerio = require('cheerio');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//set global variable available to all views
app.locals.title = 'The Worst Calendar Ever';

//middleware for sass to css
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));

// to parse form data to object
app.use(bodyParser.urlencoded({ extended: false}));
// to parse incoming json to object
app.use(bodyParser.json());

//setting path to public folder to serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', {
    date: new Date()
  });
});

//sending json data
app.get('/api', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send({ hello: 'world' });
})
//post data to an api
app.post('/api', (req, res) => {
  const obj = _.mapValues(req.body, (val) => val.toUpperCase());
  //console.log(req.body);
  res.send(obj);
});
//make a third party api request
app.get('/api/weather', (req, res) => {
  const url = 'https://api.forecast.io/forecast/0a240dea0feab43866d24f9adb42399a/37.8267,-122.423';
  request.get(url, (err, response, body) => {
    if (err) throw err;
    res.header('Access-Control-Allow-Origin', '*');
    res.send(JSON.parse(body));
  });
});

// WEB SCRAPING
app.get('/api/news', (req, res) => {
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

    _.range(1,12).map(i => {
      const $headline = $cdHeadline.eq(i);
      news.push({
        title: $headline.text(),
        url: url + $headline.find('a').attr('href')
      });
    });

    res.send(news);
  })
});


app.get('/contact', (req, res) => {
  res.render('contact');
});

app.post('/contact', (req, res) => {
  const name = req.body.name;
  res.send(`<h1>Thanks for contacting us ${name}`);
});

app.get('/sendphoto', (req, res) => {
  res.render('sendphoto');
});

app.post('/sendphoto', upload.single('image'), function (req,res) {
  console.log(req.body, req.file);
  imgur.uploadFile(req.file.path)
    .then(function (json) {
        console.log('IMGUR SUCCESS', json.data.link);
    })
    .catch(function (err) {
        console.error('IMGUR ERROR', err.message);
    });
  res.send('<h1>Thansk for sending your photo');
});

app.get('/hello', (req, res) => {
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

app.get('/cal/:month/:year', (req, res) => {
  const monthJS = require('node-cal/lib/month');
  var month = parseInt(req.params.month);
  var year = parseInt(req.params.year);
  res.end(`${monthJS.monthToString(month, year)}`);
});

app.get('/random/:min/:max', (req, res) => {
  var min = parseInt(req.params.min);
  var max = parseInt(req.params.max);
  console.log(min);
  console.log(max);
  res.end((Math.floor(Math.random() * (max - min + 1)) + min).toString());
});

app.all('*', (req, res) => {
  res.status(403).send('Access Denied!');
});


app.listen(PORT, () => {
  console.log(`node.js server started. listening on port ${PORT}`);
});
