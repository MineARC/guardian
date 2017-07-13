var express = require('express');
var hostdiscovery = require('../hostdiscovery');
var jumpers = require('../jumpers');
var alias = require('../alias');
var router = express.Router();

router.get('/', function (req, res, next) {
  var data = {};
  data['alias'] = alias.alias;
  data['localize'] = jumpers.localize;
  if (jumpers.cams) data['cams'] = true;
  if (jumpers.aura) data['aura'] = true;
  if (jumpers.extn) data['extn'] = true;
  data['hosts'] = hostdiscovery.hosts_data;

  res.render('contact', data);
});

module.exports = router;