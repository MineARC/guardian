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
    db.run('CREATE TABLE Alarms (email TEXT UNIQUE, subscription, sent)');
  }
});

// Returns via callback a list of all emails, their subscriptions and sent status
// { email: 'email', subscription: [], sent: {} }
exports.getAll = function (callback) {
  db.serialize(function () {
    db.all('SELECT email, subscription, sent FROM Alarms', function (err, rows) {
      var all = [];
      rows.reduce(function (prev, curr) {
        prev.push({ email: curr.email, subscription: JSON.parse(curr.subscription), sent: JSON.parse(curr.sent) });
        return prev;
      }, all);
      callback(err, all);
    });
  });
}

// Returns via callback a list of all emails, their subscriptions
// { email: 'email', subscription: [] }
exports.getEmailsAndSubscriptions = function (callback) {
  db.serialize(function () {
    db.all('SELECT email, subscription FROM Alarms', function (err, rows) {
      var all = [];
      rows.reduce(function (prev, curr) {
        prev.push({ email: curr.email, subscription: JSON.parse(curr.subscription) });
        return prev;
      }, all);
      callback(err, all);
    });
  });
}

// Returns via callback a list of all emails
exports.getEmails = function (callback) {
  db.serialize(function () {
    db.all('SELECT email FROM Alarms', function (err, rows) {
      var emails = [];
      rows.reduce(function (prev, curr) {
        prev.push(curr.email);
        return prev;
      }, emails)
      callback(err, emails);
    });
  });
}

// Adds a email to the database with supplied subscription list and empty sent status
exports.addEmail = function (email, subscription, callback) {
  if (!email) {
    return callback(new Error('Invalid input'));
  }
  else if (!subscription) {
    subscription = [];
  }

  db.serialize(function () {
    if (typeof subscription !== 'string') {
      subscription = JSON.stringify(subscription);
    }
    var sent = {};
    sent = JSON.stringify(sent);

    db.run('INSERT INTO Alarms VALUES (?, ?, ?)', email, subscription, sent, function (err) {
      return callback(err, this.lastID > 0);
    });
  });
}

// Removes given email
exports.removeEmail = function (email, callback) {
  db.serialize(function () {
    if (!email) {
      return callback(new Error('Invalid input'));
    }

    db.run('DELETE FROM Alarms WHERE email LIKE ?', email, function (err) {
      return callback(err, this.changes > 0);
    });
  });
}

// Changes the email of an entry
exports.setEmail = function (email, update, callback) {
  db.serialize(function () {
    if (!email || !update) {
      return callback(new Error('Invalid input'));
    }

    db.run('UPDATE Alarms SET email = ? WHERE email LIKE ?', email, function (err) {
      callback(err, this.changes > 0);
    });
  });
}

// Gets the subscription of the given email
exports.getSubscription = function (email, callback) {
  db.serialize(function () {
    if (!email) {
      return callback(new Error('Invalid input'));
    }

    db.get('SELECT subscription FROM Alarms WHERE email LIKE ?', email, function (err, row) {
      callback(err, JSON.parse(row.subscription));
    });
  });
}

// Updates the subscription of the given email
exports.setSubscription = function (email, subscription, callback) {
  db.serialize(function () {
    if (!email || !subscription) {
      return callback(new Error('Invalid input'));
    }

    if (typeof subscription !== 'string') {
      subscription = JSON.stringify(subscription);
    }

    db.run('UPDATE Alarms SET subscription = ? WHERE email LIKE ?', subscription, email, function (err) {
      callback(err, this.changes > 0);
    });
  });
}

// Gets the sent state of the given email
exports.getSent = function (email, callback) {
  db.serialize(function () {
    if (!email) {
      return callback(new Error('Invalid input'));
    }

    db.get('SELECT sent FROM Alarms WHERE email LIKE ?', email, function (err, row) {
      callback(err, JSON.parse(row.sent));
    });
  });
}

// Updates the sent state of the given email
exports.setSent = function (email, sent, callback) {
  db.serialize(function () {
    if (!email || !sent) {
      return callback(new Error('Invalid input'));
    }

    if (typeof sent !== 'string') {
      sent = JSON.stringify(sent);
    }

    db.run('UPDATE Alarms SET sent = ? WHERE email LIKE ?', sent, email, function (err) {
      callback(err, this.changes > 0);
    });
  });
}