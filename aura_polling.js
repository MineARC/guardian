var request = require('request');
var cheerio = require('cheerio');
var jq = require('jquery');
var fs = require('fs');
var db = require('./database');

setInterval(poll_database, 10000);
poll_database();

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
  'Temp High': { state: false, type: 'aura' },
  'H2S High': { state: false, type: 'aura' }
}

var timestamps = {
  Temp: 0,
  Temp_F: 0,
  Humid: 0,
  Press: 0,
  O2: 0,
  CO2: 0,
  CO: 0,
  H2S: 0,
}

var aura_data = {
  Temp: { value: 0, unit: 'C', isRecent: false },
  Temp_F: { value: 0, unit: 'F', isRecent: false },
  Humid: { value: 0, unit: '%', isRecent: false },
  Press: { value: 0, unit: 'hPa', isRecent: false },
  O2: { value: 0, unit: '%', isRecent: false },
  CO2: { value: 0, unit: '%', isRecent: false },
  CO: { value: 0, unit: 'ppm', isRecent: false },
  H2S: { value: 0, unit: 'ppm', isRecent: false },
};

exports.data = aura_data;
exports.alarms = aura_alarms;

// Spin up polling of backend services
setInterval(poll_aura, 10000);
poll_aura();

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

  if (jq('p').first().text() == 'version = 1.0' || jq('p').first().text() == 'version = 1.1') {
    jq('tr').each(function (index, element) {
      gas_name = jq(element).find('td').first().text();
      gas_value = jq(element).find('td').first().next().text();
      if (gas_name in aura_data) {
        switch (gas_name) {
          case 'CO':
            break;
          case 'CO2':
            gas_value /= 10000;
            gas_value = gas_value.toFixed(2);
            break;
          case 'O2':
            gas_value = parseFloat(gas_value).toFixed(1);
            break;
          default:
            break;
        }
        aura_data[gas_name].value = gas_value;
        timestamps[gas_name] = Date.now();
      }
    });
  }
  else {
    jq('tr').each(function (index, element) {
      gas_name = jq(element).find('td').first().text().split(' ')[0];
      gas_value = jq(element).find('td').first().next().text();
      if (gas_name in aura_data) {
        aura_data[gas_name].value = gas_value;
        timestamps[gas_name] = Date.now();
      }
    });
  }
}

function updateAlarms() {
  aura_alarms['O2 Low'].state = aura_data.O2.isRecent && aura_data.O2.value <= 18.5;
  aura_alarms['O2 High'].state = aura_data.O2.isRecent && aura_data.O2.value >= 23;
  aura_alarms['CO2 High'].state = aura_data.CO2.isRecent && aura_data.CO2.value >= 1;
  aura_alarms['CO High'].state = aura_data.CO.isRecent && aura_data.CO.value >= 35;
  aura_alarms['Temp Low'].state = aura_data.Temp.isRecent && aura_data.Temp.value <= 0;
  aura_alarms['Temp High'].state = aura_data.Temp.isRecent && aura_data.Temp.value >= 40;
  aura_alarms['Temp Low'].state |= aura_data.Temp_F.isRecent && aura_data.Temp_F.value <= 32;
  aura_alarms['Temp High'].state |= aura_data.Temp_F.isRecent && aura_data.Temp_F.value >= 104;
  aura_alarms['H2S High'].state = aura_data.H2S.isRecent && aura_data.H2S.value >= 15;
}

function updateHistory() {
  var history_data = {
    Temp: aura_data.Temp.value,
    Temp_F: aura_data.Temp_F.value,
    Humid: aura_data.Humid.value,
    Press: aura_data.Press.value,
    O2: aura_data.O2.value,
    CO2: aura_data.CO2.value,
    CO: aura_data.CO.value,
    H2S: aura_data.H2S.value
  }

  db.addMonitorData(5, history_data, function (err, success) {
    if (err)
      return console.log(err.message);
  });
}