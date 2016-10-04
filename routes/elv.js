var express = require('express');
var elv_polling = require('../elv_polling');
var router = express.Router();

router.get('/', function (req, res, next) {
  var data = {};
  data['elv'] = elv_polling.data;
  res.render('elv', data);
});

module.exports = router;
