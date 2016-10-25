var db = require('./database');

var alias = '';

exports.alias = alias;

exports.setState = function (state, value) {
  db.setState(state, value, function (err, changes) {
    if (err) {
      console.log(err.message);
    }

    if (state == 'alias')
      exports.alias = value;
  });
}

exports.getState = function (state, callback) {
  db.getState(function (err, all) {
    if (err) {
      return callback(err);
    }

    return callback(err, all[state]);
  });
}

db.getState(function (err, all) {
  if (err) {
    console.log(err.message);
  }

  console.log(all);
  exports.alias = all.alias;
});

