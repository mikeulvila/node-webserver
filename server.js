'use strict'
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

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

const imgur = require('imgur');
const fs = require('fs');

// routes
const routes = require('./routes/routes.js');

// mongodb connection
//const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');
const MONGODB_URL = 'mongodb://localhost:27017/node-webserver'

let db;

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



// mongoose connection
mongoose.connect(MONGODB_URL);


// mongoose connection
mongoose.connection.on('open', () => {
  console.log('MONGOOSE');
  //if (err) throw err;
  //db = database;
  app.listen(PORT, () => {
    console.log(`node.js server started. listening on port ${PORT}`);
  });
});

module.exports = app;


