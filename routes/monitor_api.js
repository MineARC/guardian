var express = require('express');
var polling = require('../polling');
var fixedgas = require('../fixedgas');
var cams = require('../cams');
var router = express.Router();

router.get('/', function (req, res, next) {
  var data = polling.monitor_data;
  data['fgm'] = fixedgas.fgm_data;
  data['cams'] = cams.cams_data;
  res.json(data);
});

module.exports = router;
