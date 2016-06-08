var express = require('express');
var fs = require('fs');
var path = require('path');
var underscore = require('underscore');
var camera = require('../camera');
var router = express.Router();

/* GET api json for hik camera */
router.get(['/', '/internal'], function (req, res, next) {
  res.header('content-type', 'image/jpg');
  res.end(camera.camera_data.internal, 'binary');
});

/* GET api json for hik camera */
router.get('/external', function (req, res, next) {
  res.header('content-type', 'image/jpg');
  res.end(camera.camera_data.external, 'binary');
});

module.exports = router;