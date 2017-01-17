var sqlite3 = require("sqlite3").verbose();
var fs = require("fs");
var os = require('os');
var crypto = require("crypto");
var exports = module.exports;

var file = "guardian.db";
var exists = fs.existsSync(file);
var db = new sqlite3.Database(file);

// Setup the database if it is not already
db.serialize(function () {
  if (!exists) {
    db.run("CREATE TABLE Alarms (email TEXT UNIQUE, subscription BLOB, sent INT)");
    db.run("CREATE TABLE Guardians (name TEXT UNIQUE, status BLOB, lastseen DATETIME)");
    db.run("CREATE TABLE State (state TEXT UNIQUE, value BLOB)");
    db.run("INSERT INTO State VALUES ('alias', ?)", JSON.stringify(os.hostname()));

    db.run("CREATE TABLE ELV (data BLOB, time DATETIME)");
    db.run("CREATE TRIGGER ELV_Cleanup AFTER INSERT ON ELV BEGIN DELETE FROM ELV WHERE time <= datetime('now', '-24 hour'); END");

    db.run("CREATE TABLE ELVP (data BLOB, time DATETIME)");
    db.run("CREATE TRIGGER ELVP_Cleanup AFTER INSERT ON ELVP BEGIN DELETE FROM ELVP WHERE time <= datetime('now', '-24 hour'); END");

    db.run("CREATE TABLE Series3 (data BLOB, time DATETIME)");
    db.run("CREATE TRIGGER Series3_Cleanup AFTER INSERT ON Series3 BEGIN DELETE FROM Series3 WHERE time <= datetime('now', '-24 hour'); END");

    db.run("CREATE TABLE Series4 (data BLOB, time DATETIME)");
    db.run("CREATE TRIGGER Series4_Cleanup AFTER INSERT ON Series4 BEGIN DELETE FROM Series4 WHERE time <= datetime('now', '-24 hour'); END");

    db.run("CREATE TABLE CAMS (data BLOB, time DATETIME)");
    db.run("CREATE TRIGGER CAMS_Cleanup AFTER INSERT ON CAMS BEGIN DELETE FROM CAMS WHERE time <= datetime('now', '-24 hour'); END");

    db.run("CREATE TABLE Aura (data BLOB, time DATETIME)");
    db.run("CREATE TRIGGER Aura_Cleanup AFTER INSERT ON Aura BEGIN DELETE FROM Aura WHERE time <= datetime('now', '-24 hour'); END");
  }
});

// Returns via callback a list of all emails, their subscriptions and sent status
// { email: "email", subscription: [], sent: {} }
exports.getAll = function (callback) {
  db.serialize(function () {
    db.all("SELECT email, subscription, sent FROM Alarms", function (err, rows) {
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
// { email: "email", subscription: [] }
exports.getEmailsAndSubscriptions = function (callback) {
  db.serialize(function () {
    db.all("SELECT email, subscription FROM Alarms", function (err, rows) {
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
    db.all("SELECT email FROM Alarms", function (err, rows) {
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
  if (email == null) {
    return callback(new Error("Invalid input"));
  }
  else if (!subscription) {
    subscription = {};
  }

  db.serialize(function () {
    if (typeof subscription !== "string") {
      subscription = JSON.stringify(subscription);
    }
    var sent = {};
    sent = JSON.stringify(sent);

    db.run("INSERT INTO Alarms VALUES (?, ?, ?)", email, subscription, sent, function (err) {
      return callback(err, this.lastID > 0);
    });
  });
}

// Removes given email
exports.removeEmail = function (email, callback) {
  db.serialize(function () {
    if (email == null) {
      return callback(new Error("Invalid input"));
    }

    db.run("DELETE FROM Alarms WHERE email LIKE ?", email, function (err) {
      return callback(err, this.changes > 0);
    });
  });
}

// Changes the email of an entry
exports.setEmail = function (email, update, callback) {
  db.serialize(function () {
    if (email == null || update == null) {
      return callback(new Error("Invalid input"));
    }

    db.run("UPDATE Alarms SET email = ? WHERE email LIKE ?", email, function (err) {
      callback(err, this.changes > 0);
    });
  });
}

// Gets the subscription of the given email
exports.getSubscription = function (email, callback) {
  db.serialize(function () {
    if (email == null) {
      return callback(new Error("Invalid input"));
    }

    db.get("SELECT subscription FROM Alarms WHERE email LIKE ?", email, function (err, row) {
      callback(err, row ? JSON.parse(row.subscription) : "");
    });
  });
}

// Updates the subscription of the given email
exports.setSubscription = function (email, subscription, callback) {
  db.serialize(function () {
    if (email == null || subscription == null) {
      return callback(new Error("Invalid input"));
    }

    subscription = JSON.stringify(subscription);

    db.run("UPDATE Alarms SET subscription = ? WHERE email LIKE ?", subscription, email, function (err) {
      callback(err, this.changes > 0);
    });
  });
}

// Gets the sent state of the given email
exports.getSent = function (email, callback) {
  db.serialize(function () {
    if (email == null) {
      return callback(new Error("Invalid input"));
    }

    db.get("SELECT sent FROM Alarms WHERE email LIKE ?", email, function (err, row) {
      callback(err, row ? JSON.parse(row.sent) : "");
    });
  });
}

// Updates the sent state of the given email
exports.setSent = function (email, sent, callback) {
  db.serialize(function () {
    if (email == null || sent == null) {
      return callback(new Error("Invalid input"));
    }

    sent = JSON.stringify(sent);

    db.run("UPDATE Alarms SET sent = ? WHERE email LIKE ?", sent, email, function (err) {
      callback(err, this.changes > 0);
    });
  });
}

exports.addGuardian = function (name, status, callback) {
  if (name == null) {
    return callback(new Error("Invalid input"));
  }
  else if (!status) {
    status = [];
  }

  db.serialize(function () {
    status = JSON.stringify(status);

    db.run("INSERT OR REPLACE INTO Guardians VALUES (?, ?, datetime())", name, status, function (err) {
      return callback(err, this.lastID > 0);
    });
  });
}

exports.getRecentGuardians = function (callback) {
  db.serialize(function () {
    db.all("SELECT name, status FROM Guardians WHERE lastseen >= datetime('now', '-5 minutes') ORDER BY name", function (err, rows) {
      var all = [];
      if (rows) {
        rows.reduce(function (prev, curr) {
          prev.push(JSON.parse(curr.status));
          return prev;
        }, all);
      }
      callback(err, all);
    });
  });
}

exports.addMonitorData = function (type, data, callback) {
  if (data == null) {
    return callback(new Error("Invalid input"));
  }

  db.serialize(function () {
    var monitor = "";
    switch (type) {
      case 0:
        monitor = "ELV";
        break;
      case 1:
        monitor = "ELVP";
        break;
      case 2:
        monitor = "Series3";
        break;
      case 3:
        monitor = "Series4";
        break;
      case 4:
        monitor = "CAMS";
        break;
      case 5:
        monitor = "Aura";
        break;
      default:
        return callback(new Error("Invalid input"));
    }

    data = JSON.stringify(data);

    db.run("INSERT INTO " + monitor + " VALUES (?, datetime())", data, function (err) {
      return callback(err, this.lastID > 0);
    });
  });
}

exports.getMonitorData = function (type, callback) {
  if (type == null) {
    return callback(new Error("Invalid input"));
  }

  db.serialize(function () {
    var monitor = "";
    switch (type) {
      case 0:
        monitor = "ELV";
        break;
      case 1:
        monitor = "ELVP";
        break;
      case 2:
        monitor = "Series3";
        break;
      case 3:
      default:
        monitor = "Series4";
        break;
      case 4:
        monitor = "CAMS";
        break;
      case 5:
        monitor = "Aura";
        break;
    }
    db.all("SELECT data, strftime('%s', time) AS seconds FROM " + monitor + " WHERE time >= datetime('now', '-24 hour') ORDER BY seconds", function (err, rows) {
      var all = [];
      if (rows) {
        for (var i = 0; i < rows.length; i++) {
          var event = JSON.parse(rows[i].data);
          event.Time = +(rows[i].seconds);
          all.push(event);
        }
      }
      callback(err, all);
    });
  });
}

// Gets the subscription of the given email
exports.getState = function (state, callback) {
  db.serialize(function () {
    db.get("SELECT value FROM State WHERE state = ?", state, function (err, row) {
      console.log(JSON.stringify(row));
      callback(err, row ? JSON.parse(row.value) : null);
    });
  });
}

// Updates the subscription of the given email
exports.setState = function (state, value, callback) {
  db.serialize(function () {
    if (state == null || value == null) {
      return callback(new Error("Invalid input"));
    }
    value = JSON.stringify(value);
    db.run("INSERT OR REPLACE INTO State VALUES (?, ?)", state, value, function (err) {
      callback(err, this.changes > 0);
    });
  });
}