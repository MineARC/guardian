var request = require('request');
var cheerio = require('cheerio');
var jq = require('jquery');
var fs = require('fs');

setInterval(poll_database, 10000);

function poll_database() {
  db.getMonitorData(5, function (err, data) {
    if (err) {
      return console.log(err.message);
    }
    exports.history = data;
  });
}

var aura_alarms = {
  'O2 Low': { state: false, type: 'aura' },
  'O2 High': { state: false, type: 'aura' },
  'CO2 High': { state: false, type: 'aura' },
  'CO High': { state: false, type: 'aura' },
  'Temp Low': { state: false, type: 'aura' },
  'Temp High': { state: false, type: 'aura' }
}

var timestamps = {
  Temp: 0,
  Humid: 0,
  Press: 0,
  O2: 0,
  CO2: 0,
  CO: 0,
}

var aura_data = {
  Temp: { value: 0, unit: 'C', isRecent: false },
  Humid: { value: 0, unit: '%', isRecent: false },
  Press: { value: 0, unit: 'hPa', isRecent: false },
  O2: { value: 0, unit: '%', isRecent: false },
  CO2: { value: 0, unit: '%', isRecent: false },
  CO: { value: 0, unit: 'ppm', isRecent: false },
};

exports.data = aura_data;
exports.alarms = aura_alarms;

// Spin up polling of backend services
setInterval(poll_aura, 10000);

function poll_aura() {
  var request_options = {
    url: 'http://localhost/pt/aura/',
    proxy: ''
  };

  request.get(request_options, function (err, res, body) {
    if (!err && (res.statusCode == 200 || res.statusCode == 304)) {
      processPage(body);
      for (var gas in aura_data) {
        aura_data[gas].isRecent = timestamps[gas] >= Date.now() - 120000;
      }
      updateAlarms();
      updateHistory();
    }
  });
}

function processPage(data) {
  jq = cheerio.load(data);

  // Create an object to store the status
  var gas_name = '';
  var gas_value = '';

  jq('tr').each(function (index, element) {
    gas_name = jq(element).find('td').first().text();
    gas_value = jq(element).find('td').first().next().text();
    if (gas_name in aura_data) {
      aura_data[gas_name].value = gas_value;
      timestamp[gas_name] = Date.now();
    }
  });
}

function updateAlarms() {
  aura_alarms['O2 Low'].state = aura_data.O2.isRecent && aura_data.O2.value <= 18.5;
  aura_alarms['O2 High'].state = aura_data.O2.isRecent && aura_data.O2.value >= 23;
  aura_alarms['CO2 High'].state = aura_data.O2.isRecent && aura_data.O2.value >= 5000;
  aura_alarms['CO High'].state = aura_data.O2.isRecent && aura_data.O2.value >= 35;
  aura_alarms['Temp Low'].state = aura_data.O2.isRecent && aura_data.O2.value <= 0;
  aura_alarms['Temp High'].state = aura_data.O2.isRecent && aura_data.O2.value >= 50;
}

function updateHistory() {
  var history_data = {
    Temp: aura_data.Temp,
    Humid: aura_data.Humid,
    Press: aura_data.Press,
    O2: aura_data.O2,
    CO2: aura_data.CO2,
    CO: aura_data.CO
  }

  db.addMonitorData(5, history_data, function (err, success) {
    if (err)
      return console.log(err.message);
  });
}