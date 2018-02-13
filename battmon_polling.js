var can = require('socketcan');
var db = require('./database');

setInterval(poll_database, 10000);
poll_database();

function poll_database() {
  db.getMonitorData(5, function(err, data) {
    if (err) {
      return console.log(err.message);
    }
    exports.history = data;
  });
}

var battmon_alarms = {'Voltage Low' : {state : false, type : 'battmon'}}

var battmon_data = {Voltage : {value : 0, unit : 'V'}};

exports.data = battmon_data;
exports.alarms = battmon_alarms;

var channel = can.createRawChannel('can0', true);
channel.addListener('onMessage', battmon_message);
channel.start();

function battmon_message(msg) { console.log(msg); }

function updateAlarms() { battmon_alarms['Voltage Low'].state = false; }

function updateHistory() {
  var history_data = {Voltage : battmon_data.Voltage.value};

  db.addMonitorData(5, history_data, function(err, success) {
    if (err)
      return console.log(err.message);
  });
}