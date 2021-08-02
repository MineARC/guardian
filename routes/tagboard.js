var express = require('express');
var hostdiscovery = require('../hostdiscovery');
var router = express.Router();

/* GET tagboard */
router.get('/', function (req, res, next) {
  var data = {}
  data['hosts'] = hostdiscovery.hosts_data;
  res.render('tagboard', data);
});

module.exports = router;