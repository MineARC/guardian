var db = require('./database');

var alias = 'guardian';

exports.alias = alias;

exports.setAlias = function (value) {
  db.setState('alias', value, function (err, changes) {
    if (err) {
      console.log(err.message);
    }
    exports.alias = value;
  });
}

db.getState('alias', function (err, value) {
  if (err) {
    console.log(err.message);
  }
  exports.alias = value;
});