var express = require('express');
var os = require('os');
var hostdiscovery = require('../hostdiscovery');
var db = require('../database');

var router = express.Router();

/* GET api for overview. */
router.get('/', function (req, res, next) {
  data = {};
  data['hosts'] = hostdiscovery.hosts_data;
  res.json(data);
});

module.exports = router;