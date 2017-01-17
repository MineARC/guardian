var fs = require('fs');
var path = require('path');
var underscore = require('underscore');

// Define object for access from where they are needed
exports.data = { internal: '', external: '' };

// Spin up polling of backend services
var is_running = true;
getMostRecentFileName(function (internal, external) {
  exports.data = { internal: internal, external: external };
  is_running = false;
});
setInterval(function () {
  if (!is_running) {
    is_running = true;
    getMostRecentFileName(function (internal, external) {
      exports.data = { internal: internal, external: external };
      is_running = false;
    });
  }
}, 1000);


function getMostRecentFileName(next) {
  var internal_image = (' ' + exports.data.internal).slice(1);
  var external_image = (' ' + exports.data.external).slice(1);

  console.log

  var internal_dir = '/media/ftp/internal';
  var external_dir = '/media/ftp/external';

  var internal_files = fs.readdirSync(internal_dir);
  var external_files = fs.readdirSync(external_dir);
  var del = [];

  // Itterate over files in the directory to find the newest
  var internal_name = underscore.max(internal_files, function (f) {
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
  del = del.filter(function (element) { return element != internal_name; });
  del.forEach(function (element) { fs.unlink(path.join(internal_dir, element)); });
  del = [];

  // Itterate over files in the directory to find the newest
  var external_name = underscore.max(external_files, function (f) {
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
  del = del.filter(function (element) { return element != external_name; });
  del.forEach(function (element) { fs.unlink(path.join(external_dir, element)); });

  setTimeout(function () {
    if (internal_name != -Infinity) {
      var file = path.join(internal_dir, internal_name);
      internal_image = fs.readFileSync(file, 'binary');
    }

    if (external_name != -Infinity) {
      file = path.join(external_dir, external_name);
      external_image = fs.readFileSync(file, 'binary');
    }

    next(internal_image, external_image);
  }, 300);
}