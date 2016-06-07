var express = require('express');
var fs = require('fs');
var path = require('path');
var underscore = require('underscore');
var router = express.Router();

/* GET api json for hik camera */
router.get(['/', '/internal'], function (req, res, next) {
  // Get file name of the latest image
  var f = getMostRecentFileName('.');

  // Check to makesure we have an image
  if (f == -Infinity) {
    return res.send('no image to display');
  }

  // Read image from disk
  var img = fs.readFileSync(f, 'binary');
  res.header('content-type', 'image/jpg');
  res.end(img, 'binary');
});

function getMostRecentFileName(dir) {
  var files = fs.readdirSync(dir);
  var del = [];

  // Itterate over files in the directory to find the newest
  var name = underscore.max(files, function (f) {
    // Check if the file is a jpeg
    if (f.match('.*\\.jpe?g')) {
      // Add images to list to delete
      del.push(f);

      var fullpath = path.join(dir, f);
      // Check the creation time of the file
      return fs.statSync(fullpath).ctime;
    }
  });

  // Remove the latest image from the list
  del = underscore.reject(del, function (element) { return element == name; });

  // Delete the rest
  del.forEach(function (element) {
    fs.unlink(element);
  });

  return name;
}

/* GET api json for hik camera */
router.get('/external', function (req, res, next) {
  // Get file name of the latest image
  var f = getMostRecentFileName('.');

  // Check to makesure we have an image
  if (f == -Infinity) {
    return res.send('no image to display');
  }

  // Read image from disk
  var img = fs.readFileSync(f, 'binary');
  res.header('content-type', 'image/jpg');
  res.end(img, 'binary');
});

function getMostRecentFileName(dir) {
  var files = fs.readdirSync(dir);
  var del = [];

  // Itterate over files in the directory to find the newest
  var name = underscore.max(files, function (f) {
    // Check if the file is a jpeg
    if (f.match('.*\\.jpe?g')) {
      // Add images to list to delete
      del.push(f);

      var fullpath = path.join(dir, f);
      // Check the creation time of the file
      return fs.statSync(fullpath).ctime;
    }
  });

  // Remove the latest image from the list
  del = underscore.reject(del, function (element) { return element == name; });

  // Delete the rest
  del.forEach(function (element) {
    fs.unlink(element);
  });

  return name;
}

module.exports = router;