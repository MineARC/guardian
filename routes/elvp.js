var express = require('express');
var elvp_polling = require('../elvp_polling');
var router = express.Router();

router.get('/', function (req, res, next) {
  var data = {};
  data['elvp'] = elvp_polling.data;
  res.render('elvp', data);
});

module.exports = router;
