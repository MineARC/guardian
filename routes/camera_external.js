var express = require('express');
var hostdiscovery = require('../hostdiscovery');
var router = express.Router();

/* GET external camera */
router.get('/', function (req, res, next) {
  var data = {}
  data['hosts'] = hostdiscovery.hosts_data;
  res.render('camera_external', data);
});

module.exports = router;