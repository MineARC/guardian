var express = require('express');
var polling = require('../polling');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.json(polling.monitor_data);
});

module.exports = router;
