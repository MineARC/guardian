var can = require('socketcan');
var db = require('./database');

console.log("battmon_polling loaded");

setInterval(poll_database, 10000);
poll_database();

function poll_database() {
  db.getMonitorData(6, function(err, data) {
    if (err) {
      return console.log(err.message);
    }
    exports.history = data;
  });

  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 4; j++) {
      exports.data.Bank[i][j].Voltage.value = (Math.random() * 0.2) + 12.7;
      exports.data.Bank[i][j].Temperature.value = (Math.random() * 2.0) + 20.0;
    }
  }
}

var battmon_alarms = {
  'Voltage High' : {state : false, type : 'battmon'},
  'Voltage Low' : {state : false, type : 'battmon'},
  'Temperature High' : {state : false, type : 'battmon'},
  'Temperature Low' : {state : false, type : 'battmon'}
}

var battmon_data = {Bank : []};
for (var i = 0; i < jumpers.battmon_strings; i++) {
  battmon_data.Bank[i] = [
    {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}},
    {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}
  ];
}

exports.data = battmon_data;
exports.alarms = battmon_alarms;

var channel = can.createRawChannel('can1', true);
channel.addListener('onMessage', battmon_message);
channel.start();

function battmon_message(msg) { console.log(msg); }

function updateAlarms() {
  var isVoltHigh = false;
  var isVoltLow = false;
  var isTempHigh = false;
  var isTempLow = false;

  for (var i = 0; i < jumpers.battmon_strings; i++) {
    for (var j = 0; j < 3; j++) {
      if (battmon_data.Bank[i][j].Voltage > 14.8)
        isVoltHigh = true;
      else if (battmon_data.Bank[i][j].Voltage < 12.5)
        isVoltLow = true;

      if (battmon_data.Bank[i][j].Temperature > 30)
        isTempHigh = true;
      else if (battmon_data.Bank[i][j].Temperature < 0)
        isTempLow = true;
    }
  }

  battmon_alarms['Voltage High'].state = isVoltHigh;
  battmon_alarms['Voltage Low'].state = isVoltLow;
  battmon_alarms['Temperature High'].state = isTempHigh;
  battmon_alarms['Temperature Low'].state = isTempLow;
}

// function updateHistory() {
//   var history_data = {Voltage : battmon_data.Voltage.value};

//   db.addMonitorData(6, history_data, function(err, success) {
//     if (err)
//       return console.log(err.message);
//   });
// }