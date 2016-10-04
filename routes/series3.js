var express = require('express');
var series3_polling = require('../series3_polling');
var router = express.Router();

router.get('/', function (req, res, next) {
  var data = {};
  data['series3'] = series3_polling.data;
  res.render('series3', data);
});

module.exports = router;