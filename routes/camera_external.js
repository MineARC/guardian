var express = require('express');
var router = express.Router();

/* GET external camera */
router.get('/', function (req, res, next) {
  res.render('camera_external');
});

module.exports = router;