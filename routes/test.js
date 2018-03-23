var express = require('express');
var hostdiscovery = require('../hostdiscovery');
var jumpers = require('../jumpers');
var battmon_polling = require('../battmon_polling');
var alias = require('../alias');
var router = express.Router();

console.log("battmon route loaded");

router.get('/', function(req, res, next) {
  var data = {};
  data['alias'] = alias.alias;
  data['localize'] = jumpers.localize;
  data['battmon'] = battmon_polling.medians;
  data['hosts'] = hostdiscovery.hosts_data;
  data['battmon_strings'] = jumpers.battmon_strings;

  res.render('test', data);
});

module.exports = router;