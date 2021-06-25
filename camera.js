var fs = require('fs');
var path = require('path');
var underscore = require('underscore');

// Define object for access from where they are needed
exports.data = {
  internal: '',
  external: ''
};

// Spin up polling of backend services
var is_running = true;
getMostRecentFileName(function(internal, external) {
  exports.data = {internal: internal, external: external};
  is_running = false;
});

setInterval(function() {
  if (!is_running) {
    is_running = true;
    getMostRecentFileName(function(internal, external) {
      exports.data = {internal: internal, external: external};
      is_running = false;
    });
  }
}, 1000);

function getMostRecentFileName(next) {
  var internal_image = (' ' + exports.data.internal).slice(1);
  var external_image = (' ' + exports.data.external).slice(1);

  var internal_dir = '/media/ftp/internal';
  var external_dir = '/media/ftp/external';

  try {
    var internal_files = walk(internal_dir);
    var external_files = walk(external_dir);
    var del = [];

    // Itterate over files in the directory to find the newest
    var internal_name = underscore.max(internal_files, function(f) {
      // Check if the file is a jpeg
      if (f.match('.*\\.jpe?g')) {
        // Add images to list to delete
        del.push(f);

        // Check the creation time of the file
        return fs.statSync(f).ctime;
      }
    });

    // Remove the latest image from the list and delete the rest
    del = del.filter(function(element) {
      return element != internal_name;
    });
    del.forEach(function(element) {
      try {
        fs.unlink(element);
      } catch (e) {
      }
    });
    del = [];

    // Itterate over files in the directory to find the newest
    var external_name = underscore.max(external_files, function(f) {
      // Check if the file is a jpeg
      if (f.match('.*\\.jpe?g')) {
        // Add images to list to delete
        del.push(f);

        // Check the creation time of the file
        return fs.statSync(f).ctime;
      }
    });

    // Remove the latest image from the list and delete the rest
    del = del.filter(function(element) {
      return element != external_name;
    });
    del.forEach(function(element) {
      try {
        fs.unlink(element);
      } catch (e) {
      }
    });
  } catch (e) {
  }

  setTimeout(function() {
    try {
      if (internal_name != -Infinity) {
        internal_image = fs.readFileSync(internal_name, 'binary');
      }

      if (external_name != -Infinity) {
        external_image = fs.readFileSync(external_name, 'binary');
      }

      next(internal_image, external_image);
    } catch (e) {
      next('', '');
    }
  }, 300);
}

function walk(dir) {
  var results = [];
  var list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    var stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(walk(file));
    } else {
      /* Is a file */
      results.push(file);
    }
  });
  return results;
}
