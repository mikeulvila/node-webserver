'use strict'

const express = require('express');
const router = express.Router();

// require routes
const api = require('./api');
const cal = require('./cal');
const contact = require('./contact');
const hello = require('./hello');
const home = require('./home');
const random = require('./random');
const sendphoto = require('./sendphoto');

// use routes
router.use(api);
router.use(cal);
router.use(contact);
router.use(hello);
router.use(home);
router.use(random);
router.use(sendphoto);

module.exports = router;
