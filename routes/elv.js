var express = require('express');
var jumpers = require('../jumpers');
var elv_polling = require('../elv_polling');
var state = require('../state');
var router = express.Router();

router.get('/', function (req, res, next) {
  var data = {};
  data['alias'] = state.alias;
  if (jumpers.cams) data['cams'] = true;
  if (jumpers.aura) data['aura'] = true;
  if (jumpers.extn) data['extn'] = true;
  data['elv'] = elv_polling.data;

  res.render('elv', data);
});

module.exports = router;
