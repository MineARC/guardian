var fs = require('fs');
var path = require('path');
var underscore = require('underscore');

// Define object for access from where they are needed
exports.camera_data = { internal: '', external: '' };

// Spin up polling of backend services
var is_running = true;
getMostRecentFileName(function (internal, external) {
  exports.camera_data = { internal: internal, external: external };
  is_running = false;
});
setInterval(function () {
  if (!is_running) {
    is_running = true;
    getMostRecentFileName(function (internal, external) {
      exports.camera_data = { internal: internal, external: external };
      is_running = false;
    });
  }
}, 500);


function getMostRecentFileName(next) {
  var internal_image = '';
  var external_image = '';

  var internal_dir = './public/images/internal';
  var external_dir = './public/images/external';

  var internal_files = fs.readdirSync(internal_dir);
  var external_files = fs.readdirSync(external_dir);
  var del = [];

  // Itterate over files in the directory to find the newest
  var name = underscore.max(internal_files, function (f) {
    // Check if the file is a jpeg
    if (f.match('.*\\.jpe?g')) {
      // Add images to list to delete
      del.push(f);

      // Check the creation time of the file
      var fullpath = path.join(internal_dir, f);
      return fs.statSync(fullpath).ctime;
    }
  });

  // Remove the latest image from the list and delete the rest
  del = del.filter(function (element) { return element != name; });
  del.forEach(function (element) { fs.unlink(path.join(internal_dir, element)); });
  del = [];

  internal_image = fs.readFileSync(path.join(internal_dir, name), 'binary');

  // Itterate over files in the directory to find the newest
  name = underscore.max(external_files, function (f) {
    // Check if the file is a jpeg
    if (f.match('.*\\.jpe?g')) {
      // Add images to list to delete
      del.push(f);

      // Check the creation time of the file
      var fullpath = path.join(external_dir, f);
      return fs.statSync(fullpath).ctime;
    }
  });

  // Remove the latest image from the list and delete the rest
  del = del.filter(function (element) { return element != name; });
  del.forEach(function (element) { fs.unlink(path.join(external_dir, element)); });

  external_image = fs.readFileSync(path.join(external_dir, name), 'binary');

  next(internal_image, external_image);
}