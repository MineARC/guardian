var express = require('express');
var jumpers = require('../jumpers');
var alias = require('../alias');
if (jumpers.mode == 4) {
  var battmon_polling = require('../battmon_polling');
} else {
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
}
var router = express.Router();

router.get('/', function(req, res, next) {
  var data = {alarms : {}};
  data['alias'] = alias.alias;
  if (jumpers.mode == 4) {
    data['battmon'] = battmon_polling.data;
    for (var key in battmon_polling.alarms) {
      data.alarms[key] = battmon_polling.alarms[key];
    }
  } else {
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
  }
  res.json(data);
});

router.get('/history', function(req, res, next) {
  var history = {};
  if (jumpers.cams)
    history['cams'] = cams_polling.history;
  if (jumpers.aura)
    history['aura'] = aura_polling.history;
  if (jumpers.mode == 0)
    history['elv'] = elv_polling.history;
  if (jumpers.mode == 1)
    history['elvp'] = elvp_polling.history;
  if (jumpers.mode == 2)
    history['series3'] = series3_polling.history;
  if (jumpers.mode == 3)
    history['series4'] = series4_polling.history;

  res.json(history);
});

module.exports = router;