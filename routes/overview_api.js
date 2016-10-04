var express = require('express');
var os = require('os');
var jumpers = require('../jumpers');
if (jumpers.cams) var cams_polling = require('../cams_polling');
if (jumpers.aura) var aura_polling = require('../aura_polling');
if (jumpers.mode == 0) var elv_polling = require('../elv_polling');
if (jumpers.mode == 1) var elvp_polling = require('../elvp_polling');
if (jumpers.mode == 2) var series3_polling = require('../series3_polling');
if (jumpers.mode == 3) var series4_polling = require('../series4_polling');
var router = express.Router();

/* GET api for overview. */
router.get('/', function (req, res, next) {
  var data = {};
  data['guardian'] = true;
  data['hostname'] = os.hostname();
  data['type'] = jumpers.mode;
  if (jumpers.mode == 0) data['elv'] = elv_polling.data;
  if (jumpers.mode == 1) data['elvp'] = elvp_polling.data;
  if (jumpers.mode == 2) data['series3'] = series3_polling.data;
  if (jumpers.mode == 3) data['series4'] = series4_polling.data;
  res.json(data);
});

module.exports = router;