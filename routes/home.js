var express = require('express');
var hostdiscovery = require('../hostdiscovery');
var jumpers = require('../jumpers');
var alias = require('../alias');
if (jumpers.cams) var cams_polling = require('../cams_polling');
if (jumpers.aura) var aura_polling = require('../aura_polling');
if (jumpers.mode == 0) var elv_polling = require('../elv_polling');
if (jumpers.mode == 1) var elvp_polling = require('../elvp_polling');
if (jumpers.mode == 2) var series3_polling = require('../series3_polling');
if (jumpers.mode == 3) var series4_polling = require('../series4_polling');
var router = express.Router();

router.get('/', function (req, res, next) {
  var data = { alarms: {} };
  data['alias'] = alias.alias;
  data['localize'] = jumpers.localize;
  data['hosts'] = hostdiscovery.hosts_data;
  if (jumpers.cams) {
    data['cams'] = cams_polling.data;
    for (var key in cams_polling.alarms) {
      data.alarms[key] = cams_polling.alarms[key];
    }
  }
  if (jumpers.aura) {
    data['aura'] = aura_polling.data;
    for (var key in aura_polling.alarms) {
      data.alarms[key] = aura_polling.alarms[key];
    }
  }
  if (jumpers.extn) data['extn'] = true;
  if (jumpers.mode == 0) {
    data['elv'] = elv_polling.data;
    for (var key in elv_polling.alarms) {
      data.alarms[key] = elv_polling.alarms[key];
    }
  }
  if (jumpers.mode == 1) {
    data['elvp'] = elvp_polling.data;
    for (var key in elvp_polling.alarms) {
      data.alarms[key] = elvp_polling.alarms[key];
    }
  }
  if (jumpers.mode == 2) {
    data['series3'] = series3_polling.data;
    for (var key in series3_polling.alarms) {
      data.alarms[key] = series3_polling.alarms[key];
    }
  }
  if (jumpers.mode == 3) {
    data['series4'] = series4_polling.data;
    for (var key in series4_polling.alarms) {
      data.alarms[key] = series4_polling.alarms[key];
    }
  }

  res.render('home', data);
});

module.exports = router;