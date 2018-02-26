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

  for(var i = 0; i < 10; i++)
  {
    for(var j = 0; j < 4; j++)
    {
      battmon_data.Bank[i][j].Voltage.value = (Math.random() * 0.2) + 12.7;
      battmon_data.Bank[i][j].Temperature.value = (Math.random() * 2.0) + 20.0;
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
battmon_data.Bank[0] = [
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}},
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}
];
battmon_data.Bank[1] = [
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}},
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}
];
battmon_data.Bank[2] = [
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}},
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}
];
battmon_data.Bank[3] = [
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}},
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}
];
battmon_data.Bank[4] = [
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}},
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}
];
battmon_data.Bank[5] = [
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}},
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}
];
battmon_data.Bank[6] = [
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}},
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}
];
battmon_data.Bank[7] = [
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}},
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}
];
battmon_data.Bank[8] = [
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}},
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}
];
battmon_data.Bank[9] = [
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}},
  {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}, {Voltage : {value : 12.8, unit : 'V'}, Temperature : {value : 21.0, unit : 'C'}}
];

exports.data = battmon_data;
exports.alarms = battmon_alarms;

var channel = can.createRawChannel('can1', true);
channel.addListener('onMessage', battmon_message);
channel.start();

function battmon_message(msg) { console.log(msg); }

function updateAlarms() { battmon_alarms['Voltage Low'].state = false; }

function updateHistory() {
  var history_data = {Voltage : battmon_data.Voltage.value};

  db.addMonitorData(6, history_data, function(err, success) {
    if (err)
      return console.log(err.message);
  });
}