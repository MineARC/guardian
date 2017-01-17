var express = require('express');
var jumpers = require('../jumpers');
var alias = require('../alias');
var router = express.Router();

/* GET external camera */
router.get('/', function (req, res, next) {
  var data = {}
  data['alias'] = alias.alias;
  if (jumpers.cams) data['cams'] = true;
  if (jumpers.aura) data['aura'] = true;
  if (jumpers.extn) data['extn'] = true;
  if (jumpers.mode == 0) data['elv'] = true;
  if (jumpers.mode == 1) data['elvp'] = true;
  if (jumpers.mode == 2) data['series3'] = true;
  if (jumpers.mode == 3) data['series4'] = true;
  res.render('camera_external', data);
});

module.exports = router;