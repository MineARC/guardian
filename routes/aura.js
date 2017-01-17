var express = require('express');
var jumpers = require('../jumpers');
var aura_polling = require('../aura_polling');
var alias = require('../alias');
var router = express.Router();

router.get('/', function (req, res, next) {
  var data = {}
  data['alias'] = alias.alias;
  if (jumpers.cams) data['cams'] = true;
  if (jumpers.aura) data['aura'] = aura_polling.data;
  if (jumpers.extn) data['extn'] = true;
  if (jumpers.mode == 0) data['elv'] = true;
  if (jumpers.mode == 1) data['elvp'] = true;
  if (jumpers.mode == 2) data['series3'] = true;
  if (jumpers.mode == 3) data['series4'] = true;
  res.render('aura', data);
});

module.exports = router;