var express = require('express');
var os = require('os');
var jumpers = require('../jumpers');
var alias = require('../alias');
if (jumpers.cams)
  var cams_polling = require('../cams_polling');
if (jumpers.aura)
  var aura_polling = require('../aura_polling');
if (jumpers.mode == 0)
  var elv_polling = require('../elv_polling');
if (jumpers.mode == 1)
  var elvp_polling = require('../elvp_polling');
if (jumpers.mode == 2)
  var series3_polling = require('../series3_polling');
if (jumpers.mode == 3)
  var series4_polling = require('../series4_polling');
if (jumpers.mode == 4)
  var battmon_polling = require('../battmon_polling');
var db = require('../database');

var router = express.Router();

/* GET api for overview. */
router.get('/', function(req, res, next) {
  var data = {};
  data['guardian'] = true;
  data['hostname'] = os.hostname();
  data['alias'] = alias.alias;
  data['type'] = jumpers.mode;
  var alarms = {};
  if (jumpers.cams)
    alarms['cams'] = cams_polling.alarms;
  if (jumpers.aura)
    alarms['aura'] = aura_polling.alarms;
  if (jumpers.mode == 0)
    alarms['elv'] = elv_polling.alarms;
  if (jumpers.mode == 1)
    alarms['elvp'] = elvp_polling.alarms;
  if (jumpers.mode == 2)
    alarms['series3'] = series3_polling.alarms;
  if (jumpers.mode == 3)
    alarms['series4'] = series4_polling.alarms;
  if (jumpers.mode == 4)
    alarms['battmon'] = battmon_polling.alarms;
  var alarms_active = {};
  var alarms_total = 0;
  for (var type in alarms) {
    alarms_active[type] = [];
    for (var alarm in alarms[type]) {
      if (alarms[type][alarm].state) {
        alarms_active[type].push(alarm);
        alarms_total++;
      }
    }
  }
  data['alarms_total'] = alarms_total;
  data['alarms_active'] = alarms_active;
  db.getEmails(function(err, emails) {
    if (err) {
      console.log(err);
      return res.send(err.message);
    }
    data['emails'] = emails;
    res.json(data);
  });
});

module.exports = router;