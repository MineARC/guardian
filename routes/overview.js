var express = require('express');
var hostdiscovery = require('../hostdiscovery');
var jumpers = require('../jumpers');
var alias = require('../alias');
var router = express.Router();

/* GET overview page. */
router.get('/', function (req, res, next) {
  var data = {}
  data['alias'] = alias.alias;
  data['localize'] = jumpers.localize;
  data['sitename'] = jumpers.sitename;
  if (jumpers.cams) data['cams'] = true;
  if (jumpers.aura) data['aura'] = true;
  if (jumpers.extn) data['extn'] = true;
  if (jumpers.mode == 0) data['elv'] = true;
  if (jumpers.mode == 1) data['elvp'] = true;
  if (jumpers.mode == 2) data['series3'] = true;
  if (jumpers.mode == 3) data['series4'] = true;
  data['hosts'] = hostdiscovery.hosts_data;
  console.log(hostdiscovery.hosts_data);
  res.render('overview', data);
});

module.exports = router;