var express = require('express');
var jumpers = require('../jumpers');
var state = require('../state');
var router = express.Router();

router.post('/setAlias', function (req, res, next) {
  var alias = req.body.alias;

  if (alias == null) {
    console.log('Invalid information supplied');
    return res.send('Invalid information supplied');
  }

  state.setState('alias', alias);

  return res.send('Alias Updated');

});

module.exports = router;
