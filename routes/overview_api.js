var express = require('express');
var os = require('os');
var polling = require('../polling');
var router = express.Router();

/* GET api for overview. */
router.get('/', function (req, res, next) {
  var data = polling.monitor_data;
  res.json({ guardian: true, hostname: os.hostname(), alarms_active: polling.monitor_data.alarms_active, alarms_total: polling.monitor_data.alarms_total, mode: polling.monitor_data.mode });
});

module.exports = router;