var express = require('express');
var router = express.Router();

/* GET internal camera */
router.get('/', function (req, res, next) {
  res.render('camera_internal');
});

module.exports = router;