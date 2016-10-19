var express = require('express');
var jumpers = require('../jumpers');
var series3_polling = require('../series3_polling');
var router = express.Router();

router.get('/', function (req, res, next) {
  var data = {};
  if (jumpers.cams) data['cams'] = true;
  if (jumpers.aura) data['aura'] = true;
  if (jumpers.extn) data['extn'] = true;
  data['series3'] = series3_polling.data;

  res.render('series3', data);
});

module.exports = router;