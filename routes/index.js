var express = require('express');
var polling = require('../polling');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', polling.monitor_data);
});

module.exports = router;