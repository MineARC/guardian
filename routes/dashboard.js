var express = require('express');
var polling = require('../polling');
var router = express.Router();

/* GET dashboard page. */
router.get('/', function (req, res, next) {
  res.render('dashboard');
});

module.exports = router;