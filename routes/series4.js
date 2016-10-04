var express = require('express');
var series4_polling = require('../series4_polling');
var router = express.Router();

router.get('/', function (req, res, next) {
  var data = {};
  data['series4'] = series4_polling.data;
  res.render('series4', data);
});

module.exports = router;