var express = require('express');
var jumpers = require('../jumpers');
var series4_polling = require('../series4_polling');
var router = express.Router();

router.get('/', function (req, res, next) {
  var data = {};
  if (jumpers.cams) data['cams'] = true;
  if (jumpers.aura) data['aura'] = true;
  if (jumpers.extn) data['extn'] = true;
  data['series4'] = series4_polling.data;

  res.render('series4', data);
});

module.exports = router;