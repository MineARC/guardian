var express = require('express');
var hostdiscovery = require('../hostdiscovery');
var jumpers = require('../jumpers');
var elvp_polling = require('../elvp_polling');
var alias = require('../alias');
var router = express.Router();

router.get('/', function (req, res, next) {
  var data = {};
  data['alias'] = alias.alias;
  data['localize'] = jumpers.localize;
  if (jumpers.cams) data['cams'] = true;
  if (jumpers.aura) data['aura'] = true;
  if (jumpers.extn) data['extn'] = true;
  data['elvp'] = elvp_polling.data;
  data['hosts'] = hostdiscovery.hosts_data;

  res.render('elvp', data);
});

module.exports = router;