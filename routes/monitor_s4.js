var express = require('express');
var polling = require('../polling');
var router = express.Router();

/* GET series 4 controller */
router.get('/', function (req, res, next) {
  res.render('monitor_s4', polling.monitor_data);
});

module.exports = router;