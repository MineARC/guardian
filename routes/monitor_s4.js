var express = require('express');
var router = express.Router();

/* GET series 4 controller */
router.get('/', function (req, res, next) {
  res.render('monitor_s4');
});

module.exports = router;