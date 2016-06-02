var express = require('express');
var os = require('os');
var hostdiscovery = require('../hostdiscovery');
var router = express.Router();

/* GET dashboard page. */
router.get('/', function (req, res, next) {
  var data = hostdiscovery.hosts_data;
  res.render('dashboard', data);
});

module.exports = router;