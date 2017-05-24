var express = require('express');
var jumpers = require('../jumpers');
var alias = require('../alias');
var router = express.Router();

router.post('/setAlias', function (req, res, next) {
  var value = req.body.alias.trim();

  if (value == null) {
    console.log('Invalid information supplied');
    return res.send('Invalid information supplied');
  }

  alias.setAlias(value);

  return res.send('Alias Updated');

});

module.exports = router;