var request = require('request');
var cheerio = require('cheerio');
var jq = require('jquery');
var db = require('./database');
var jumpers = require('./jumpers');

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
}

var battmon_alarms = {
  'Voltage High' : {state : false, type : 'battmon'},
  'Voltage Low' : {state : false, type : 'battmon'},
  'Temperature High' : {state : false, type : 'battmon'},
  'Temperature Low' : {state : false, type : 'battmon'},
  'Balance Undervoltage' : {state : false, type : 'battmon'},
  'Balance Overvoltage' : {state : false, type : 'battmon'},
  'Balance Overcurrent' : {state : false, type : 'battmon'}
}

var battmon_data = {
  Bank : [],
  Balance :
      {MODE : false, EN1 : false, EN2 : false, TERM1 : false, TERM2 : false, BAL : false, DONE : false, BATX : false, BATY : false, UVFLT : false, OVFLT : false, PTCFLT : false}
};

for (var i = 0; i < jumpers.battmon_strings; i++) {
  battmon_data.Bank[i] = [
    {Voltage : {value : -1, unit : 'V'}, Temperature : {value : -1, unit : 'C'}}, {Voltage : {value : -1, unit : 'V'}, Temperature : {value : -1, unit : 'C'}},
    {Voltage : {value : -1, unit : 'V'}, Temperature : {value : -1, unit : 'C'}}, {Voltage : {value : -1, unit : 'V'}, Temperature : {value : -1, unit : 'C'}}
  ];
}

exports.data = battmon_data;
exports.alarms = battmon_alarms;

setInterval(poll_monitor, 10000);
poll_monitor();

function poll_monitor() {
  for (var i = 0; i < jumpers.battmon_strings; i++) {
    var request_options = {url : 'http://172.17.0.' + (128 + i), proxy : ''};

    request.get(request_options, function(err, res, body) {
      if (!err && (res.statusCode == 200 || res.statusCode == 304)) {
        processPage(body, i);
      }
    });
  }
}

function processPage(data, string) {
  jq = cheerio.load(data);

  if (jq('p').first().text() == 'version = 1.0') {
    var ltc3305 = parseInt(jq('p').first().next().text().split(" = ")[1]);
    battmon_data.Balance.MODE = ltc3305 & 0x0001;
    battmon_data.Balance.EN1 = ltc3305 & 0x0002;
    battmon_data.Balance.EN2 = ltc3305 & 0x0004;
    battmon_data.Balance.TERM1 = ltc3305 & 0x0008;
    battmon_data.Balance.TERM2 = ltc3305 & 0x0010;
    battmon_data.Balance.BAL = ltc3305 & 0x0020;
    battmon_data.Balance.DONE = ltc3305 & 0x0040;
    battmon_data.Balance.BATX = ltc3305 & 0x0080;
    battmon_data.Balance.BATY = ltc3305 & 0x0100;
    battmon_data.Balance.UVFLT = ltc3305 & 0x0200;
    battmon_data.Balance.OVFLT = ltc3305 & 0x0400;
    battmon_data.Balance.PTCFLT = ltc3305 & 0x0800;

    jq('tr').each(function(index, element) {
      var td = jq(element).find('td').first();
      string_no = td.text();
      td = td.next();
      battery_no = td.text();
      td = td.next();
      voltage = td.text();
      td = td.next();
      temperature = td.text();

      battmon_data.Bank[string_no][battery_no].Voltage.value = 1.2164 * voltage - 1.5419;
      battmon_data.Bank[string_no][battery_no].Temperature.value = 1.2164 * temperature - 1.5419;
    });
  }
}

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
  battmon_alarms['Balance Undervoltage'].state = battmon_data.Balance.UVFLT;
  battmon_alarms['Balance Overvoltage'].state = battmon_data.Balance.OVFLT;
  battmon_alarms['Balance Overcurrent'].state = battmon_data.Balance.PTCFLT;
}

// function updateHistory() {
//   var history_data = {Voltage : battmon_data.Voltage.value};

//   db.addMonitorData(6, history_data, function(err, success) {
//     if (err)
//       return console.log(err.message);
//   });
// }