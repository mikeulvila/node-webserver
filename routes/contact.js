'use strict'

const express = require('express');
const router = express.Router();

// model
const Contact = require('../models/Contact');

// controller
const ctrl = require('../controllers/contact');

// render contact.jade
router.get('/contact', ctrl.index);

  // post contact form
router.post('/contact', ctrl.newContact);

module.exports = router;
