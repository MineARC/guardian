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
    db.run('CREATE TABLE Guardians (name TEXT UNIQUE, lastseen, status)');
    db.run('CREATE TABLE Monitor (mainsvoltage, batteryvoltage, invertervoltage, insidetemp, outsidetemp, timestamp)');
  }
});

// Returns via callback a list of all emails, their subscriptions and sent status
// { email: 'email', subscription: [], sent: {} }
exports.getAll = function (callback) {
  db.serialize(function () {
    db.all('SELECT email, subscription, sent FROM Alarms', function (err, rows) {
      var all = [];
      if (rows) {
        rows.reduce(function (prev, curr) {
          prev.push({ email: curr.email, subscription: JSON.parse(curr.subscription), sent: JSON.parse(curr.sent) });
          return prev;
        }, all);
      }
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
      if (rows) {
        rows.reduce(function (prev, curr) {
          prev.push({ email: curr.email, subscription: JSON.parse(curr.subscription) });
          return prev;
        }, all);
      }
      callback(err, all);
    });
  });
}

// Returns via callback a list of all emails
exports.getEmails = function (callback) {
  db.serialize(function () {
    db.all('SELECT email FROM Alarms', function (err, rows) {
      var emails = [];
      if (rows) {
        rows.reduce(function (prev, curr) {
          prev.push(curr.email);
          return prev;
        }, emails);
      }
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
      callback(err, row ? JSON.parse(row.subscription) : '');
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
      callback(err, row ? JSON.parse(row.sent) : '');
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

exports.addGuardian = function (name, status, callback) {
  if (!name) {
    return callback(new Error('Invalid input'));
  }
  else if (!status) {
    status = [];
  }

  db.serialize(function () {
    if (typeof status !== 'string') {
      status = JSON.stringify(status);
    }

    db.run('INSERT OR REPLACE INTO Guardians VALUES (?, ?, ?)', name, new Date().getTime(), status, function (err) {
      return callback(err, this.lastID > 0);
    });
  });
}

exports.getRecentGuardians = function (callback) {
  db.serialize(function () {
    db.all('SELECT name, status FROM Guardians WHERE lastseen >= ' + ((new Date().getTime()) - 120000), function (err, rows) {
      var all = [];
      if (rows) {
        rows.reduce(function (prev, curr) {
          prev.push(JSON.parse(curr.status));
          return prev;
        }, all);
        all.sort(function (a, b) {
          return a.hostname.localeCompare(b.hostname);
        })
        console.log(all);
      }
      callback(err, all);
    });
  });
}

exports.addMonitorData = function (mainsvoltage, batteryvoltage, invertervoltage, insidetemp, outsidetemp, callback) {
  db.serialize(function () {
    db.run('INSERT INTO Monitor VALUES (?, ?, ?, ?, ?, ?)', mainsvoltage, batteryvoltage, invertervoltage, insidetemp, outsidetemp, new Date().getTime(), function (err) {
      return callback(err, this.lastID > 0);
    });
  });
}

exports.getMonitorData = function (mainsvoltage, batteryvoltage, invertervoltage, insidetemp, outsidetemp, callback) {
  db.serialize(function () {
    db.all('SELECT mainsvoltage, batteryvoltage, invertervoltage, insidetemp, outsidetemp, timestamp FROM Monitor WHERE timestamp >= ' + ((new Date().getTime()) + 120000), mainsvoltage, batteryvoltage, invertervoltage, insidetemp, outsidetemp, new Date().getTime(), function (err) {
      callback(err, all);
    });
  });
}