'use strict'

const express = require('express');
const router = express.Router();
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

// controller
const ctrl = require('../controllers/sendphoto');

//UPLOAD PHOTO PAGE
router.get('/sendphoto', ctrl.index);
// upload photo
router.post('/sendphoto', upload.single('image'), ctrl.newPhoto);

module.exports = router;
