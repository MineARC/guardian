var express = require('express');
var polling = require('../polling');
var router = express.Router();

/* GET external camera */
router.get('/', function (req, res, next) {
  res.render('camera_external', polling.monitor_data);
});

module.exports = router;