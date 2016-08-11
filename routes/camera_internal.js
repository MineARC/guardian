var express = require('express');
var polling = require('../polling');
var router = express.Router();

/* GET internal camera */
router.get('/', function (req, res, next) {
  res.render('camera_internal', polling.monitor_data);
});

module.exports = router;