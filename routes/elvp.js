var express = require('express');
var jumpers = require('../jumpers');
var elvp_polling = require('../elvp_polling');
var router = express.Router();

router.get('/', function (req, res, next) {
  var data = {};
  if (jumpers.cams) data['cams'] = true;
  if (jumpers.aura) data['aura'] = true;
  if (jumpers.extn) data['extn'] = true;
  data['elvp'] = elvp_polling.data;

  res.render('elvp', data);
});

module.exports = router;
