var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var crypto = require('crypto');
var exports = module.exports;

var file = "guardian.db";
var exists = fs.existsSync(file);
var db = new sqlite3.Database(file);

// Setup the database if it is not already
db.serialize(function () {
  if (!exists) {
    db.run('CREATE TABLE Users (username TEXT UNIQUE, password_hash TEXT, password_salt TEXT, password_function TEXT, email TEXT, settings BLOB, alerts BLOB)');
  }
});

// Returns via callback a list of all usernames in the database
exports.getUsers = function (callback) {
  db.serialize(function () {
    db.all('SELECT username FROM Users', function (err, rows) {
      var users = [];
      rows.forEach(function (val) {
        users.push(val.username);
      })
      callback(err, users);
    });
  });
}

// Adds a user to the database with default settings and alerts state
exports.addUser = function (username, password, email, callback) {
  db.serialize(function () {
    var password_salt = crypto.randomBytes(16).toString('base64');
    var password_hash = crypto.pbkdf2Sync(password, password_salt, 5000, 32, 'sha256').toString('base64');
    var password_function = 'pbkdf2, 5000, 32, sha256';
    var settings = [];
    var alerts = [];

    db.run('INSERT INTO Users VALUES (?, ?, ?, ?, ?, ?, ?)', username, password_hash, password_salt, password_function, email, settings, alerts, callback);
  });
}

// Removes given suer from the database
exports.removeUser = function (username, callback) {
  db.serialize(function () {
    db.run('DELETE FROM Users WHERE username LIKE ?', username, callback);
  });
}

// Gets the email of a given user
exports.getUsersEmail = function (username, callback) {
  db.serialize(function () {
    db.get('SELECT email FROM Users WHERE username LIKE ?', username, function (err, row) {
      callback(err, row.email);
    });
  });
}

// Updates the eamil of the given user
exports.updateUsersEmail = function (username, email, callback) {
  db.serialize(function () {
    db.run('UPDATE Users SET email = ? WHERE username LIKE ?', email, username, callback);
  });
}

// Gets the settings of the given user
exports.getUsersSettings = function (username, callback) {
  db.serialize(function () {
    db.get('SELECT settings FROM Users WHERE username LIKE ?', username, function (err, row) {
      callback(err, row.settings);
    });
  });
}

// Updates the settings of the given user
exports.updateUsersSettings = function (username, settings, callback) {
  db.serialize(function () {
    db.run('UPDATE Users SET settings = ? WHERE username LIKE ?', settings, username, callback);
  });
}

// Gets the alert state of the given user
exports.getUsersAlerts = function (username, callback) {
  db.serialize(function () {
    db.get('SELECT alerts FROM Users WHERE username LIKE ?', username, function (err, row) {
      callback(err, row.alerts);
    });
  });
}

// Updates the alert state of the given user
exports.updateUsersAlerts = function (username, alerts, callback) {
  db.serialize(function () {
    db.run('UPDATE Users SET alerts = ? WHERE username LIKE ?', alerts, username, callback);
  });
}

// Compares a plain text password of a given user with the salted hashed password of the user in the database
exports.compareUsersPassword = function (username, password, callback) {
  db.serialize(function () {
    db.get('SELECT password_hash, password_salt FROM Users WHERE username LIKE ?', username, function (err, row) {
      if (err) {
        return callback(err);
      }

      if (!row) {
        return callback(err, 'no user');
      }

      var password_hash = row.password_hash;
      var password_salt = row.password_salt;
      var result = crypto.pbkdf2Sync(password, password_salt, 5000, 32, 'sha256').toString('base64');
      callback(err, result == password_hash ? 'match' : 'no match');
    });
  });
}

// Updates the password of the given user
exports.updateUsersPassword = function (username, password, callback) {
  db.serialize(function () {
    var password_salt = crypto.randomBytes(16).toString('base64');
    var password_hash = crypto.pbkdf2Sync(password, password_salt, 5000, 32, 'sha256').toString('base64');
    var password_function = 'pbkdf2, 5000, 32, sha256';

    db.run('UPDATE Users SET password_hash = ?, password_salt = ?, password_function = ? WHERE username LIKE ?', password_hash, password_salt, password_function, username, callback);
  });
}