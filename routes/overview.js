var express = require('express');
var polling = require('../polling');
var os = require('os');
var hostdiscovery = require('../hostdiscovery');
var router = express.Router();

/* GET overview page. */
router.get('/', function (req, res, next) {
  var data = hostdiscovery.hosts_data;
  res.render('overview', data);
});

module.exports = router;