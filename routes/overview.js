var express = require('express');
var hostdiscovery = require('../hostdiscovery');
var router = express.Router();

/* GET overview page. */
router.get('/', function (req, res, next) {
  var data = {}
  data['hosts'] = hostdiscovery.data;
  res.render('overview', data);
});

module.exports = router;