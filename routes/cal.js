'use strict'

const express = require('express');
const router = express.Router();

router.get('/cal/:month/:year', (req, res) => {
  const monthJS = require('node-cal/lib/month');
  var month = parseInt(req.params.month);
  var year = parseInt(req.params.year);
  res.end(`${monthJS.monthToString(month, year)}`);
});

module.exports = router;
