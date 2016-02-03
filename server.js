'use strict'
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'jade');

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Super Cool App',
    date: new Date()
  });
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
