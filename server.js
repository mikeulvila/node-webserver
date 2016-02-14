'use strict'
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');


// routes
const routes = require('./routes/index.js');

// mongodb connection
//const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');
const MONGODB_URL = 'mongodb://localhost:27017/node-webserver'

//set global variable available to all views
app.locals.title = 'The Worst Calendar Ever';

// to parse form data to object
app.use(bodyParser.urlencoded({ extended: false}));
// to parse incoming json to object
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//setting path to public folder to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// use routes
app.use(routes);

// middleware for sass to css
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));

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


