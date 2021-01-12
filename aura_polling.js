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
  'H2S High': { state: false, type: 'aura' },
  'NH3 High': { state: false, type: 'aura' },
  'Cl High': { state: false, type: 'aura' },
  'NO High': { state: false, type: 'aura' },
  'NO2 High': { state: false, type: 'aura' },
  'CH4 High': { state: false, type: 'aura' },
  'SO2 High': { state: false, type: 'aura' },
  'HF High': { state: false, type: 'aura' },
  'ClO2 High': { state: false, type: 'aura' },
  'HCL High': { state: false, type: 'aura' },
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
  NH3: 0,
  Cl: 0,
  NO: 0,
  NO2: 0,
  CH4: 0,
  SO2: 0,
  HF: 0,
  ClO2: 0,
  HCL: 0,
}

var timestamps_ext = {
  Temp: 0,
  Temp_F: 0,
  Humid: 0,
  Press: 0,
  O2: 0,
  CO2: 0,
  CO: 0,
  H2S: 0,
  NH3: 0,
  Cl: 0,
  NO: 0,
  NO2: 0,
  CH4: 0,
  SO2: 0,
  HF: 0,
  ClO2: 0,
  HCL: 0,
}

var aura_data = {
  Temp: { value: 0, isRecent: false },
  Temp_F: { value: 0, isRecent: false },
  Humid: { value: 0, isRecent: false },
  Press: { value: 0, isRecent: false },
  O2: { value: 0, isRecent: false },
  CO2: { value: 0, isRecent: false },
  CO: { value: 0, isRecent: false },
  H2S: { value: 0, isRecent: false },
  NH3: { value: 0, isRecent: false },
  Cl: { value: 0, isRecent: false },
  NO: { value: 0, isRecent: false },
  NO2: { value: 0, isRecent: false },
  CH4: { value: 0, isRecent: false },
  SO2: { value: 0, isRecent: false },
  HF: { value: 0, isRecent: false },
  ClO2: { value: 0, isRecent: false },
  HCL: { value: 0, isRecent: false },
};

var aura_ext_data = {
  Temp: { value: 0, isRecent: false },
  Temp_F: { value: 0, isRecent: false },
  Humid: { value: 0, isRecent: false },
  Press: { value: 0, isRecent: false },
  O2: { value: 0, isRecent: false },
  CO2: { value: 0, isRecent: false },
  CO: { value: 0, isRecent: false },
  H2S: { value: 0, isRecent: false },
  NH3: { value: 0, isRecent: false },
  Cl: { value: 0, isRecent: false },
  NO: { value: 0, isRecent: false },
  NO2: { value: 0, isRecent: false },
  CH4: { value: 0, isRecent: false },
  SO2: { value: 0, isRecent: false },
  HF: { value: 0, isRecent: false },
  ClO2: { value: 0, isRecent: false },
  HCL: { value: 0, isRecent: false },
};

exports.data = aura_data;
exports.data_ext = aura_ext_data;
exports.alarms = aura_alarms;
exports.hasExt = false;

// Spin up polling of backend services
setInterval(poll_aura, 10000);
poll_aura();

function poll_aura() {
  var request_options = {
    url: 'http://localhost/pt/aura/',
    proxy: ''
  };

  var request_options_ext = {
    url: 'http://172.17.0.6/',
    proxy: ''
  };

  request.get(request_options, function (err, res, body) {
    if (!err && (res.statusCode == 200 || res.statusCode == 304)) {
      processPage(body);
    }
  });

  request.get(request_options_ext, function (err, res, body) {
    if (!err && (res.statusCode == 200 || res.statusCode == 304)) {
      processPageExt(body);
    }
  });

  for (var gas in aura_data) {
    aura_data[gas].isRecent = timestamps[gas] >= Date.now() - 120000;
  }
  for (var gas in aura_ext_data) {
    aura_ext_data[gas].isRecent = timestamps_ext[gas] >= Date.now() - 120000;
  }
  exports.hasExt = Object.keys(aura_ext_data).reduce((acc, cur) => { return aura_ext_data[cur].isRecent || acc; }, false);
  updateAlarms();
  updateHistory();
}

function processPage(data) {
  jq = cheerio.load(data);

  // Create an object to store the status
  var gas_name = '';
  var gas_value = '';
  exports.version = jq('p').first().text().split(' = ')[1];
  var major = parseInt(jq('p').first().text().split('=')[1].split('.')[0]);
  var minor = parseInt(jq('p').first().text().split('=')[1].split('.')[1]);

  if (major == 1 && minor <= 1) {
    jq('tr').each(function (index, element) {
      gas_name = jq(element).find('td').first().text();
      gas_value = jq(element).find('td').first().next().text();
      if (gas_name in aura_data) {
        switch (gas_name) {
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
  else if (major == 2 && minor >= 25) {
    exports.version_ext = jq('p').first().text().split(' = ')[1];

    jq('tr').each(function (index, element) {
      gas_name = jq(element).find('td').first().text().split(' ')[0];
      gas_value = jq(element).find('td').first().next().text();
      position = jq(element).find('td').first().next().next().next().next().text();
      if (position % 6 < 4) {
        if (gas_name in aura_data) {
          aura_data[gas_name].value = gas_value;
          timestamps[gas_name] = Date.now();
        }
      }
      else {
        if (gas_name in aura_ext_data) {
          aura_ext_data[gas_name].value = gas_value;
          timestamps_ext[gas_name] = Date.now();
        }
      }
    });
  }
  else {
    jq('tr').each(function (index, element) {
      gas_name = jq(element).find('td').first().text().split(' ')[0];
      gas_value = jq(element).find('td').first().next().text();
      if (gas_name in aura_data && gas_value != "-1.0") {
        aura_data[gas_name].value = gas_value;
        timestamps[gas_name] = Date.now();
      }
    });
  }
}

function processPageExt(data) {
  jq = cheerio.load(data);

  // Create an object to store the status
  var gas_name = '';
  var gas_value = '';
  exports.version_ext = jq('p').first().text().split(' = ')[1];
  var major = parseInt(jq('p').first().text().split('=')[1].split('.')[0]);
  var minor = parseInt(jq('p').first().text().split('=')[1].split('.')[1]);

  if (major == 1 && minor <= 1) {
    jq('tr').each(function (index, element) {
      gas_name = jq(element).find('td').first().text();
      gas_value = jq(element).find('td').first().next().text();
      if (gas_name in aura_ext_data) {
        switch (gas_name) {
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
        aura_ext_data[gas_name].value = gas_value;
        timestamps_ext[gas_name] = Date.now();
      }
    });
  }
  else {
    jq('tr').each(function (index, element) {
      gas_name = jq(element).find('td').first().text().split(' ')[0];
      gas_value = jq(element).find('td').first().next().text();
      if (gas_name in aura_ext_data) {
        aura_ext_data[gas_name].value = gas_value;
        timestamps_ext[gas_name] = Date.now();
      }
    });
  }
}

function updateAlarms() {
  aura_alarms['O2 Low'].state = aura_data.O2.isRecent && aura_data.O2.value <= 18.5;
  aura_alarms['O2 High'].state = aura_data.O2.isRecent && aura_data.O2.value >= 23;
  aura_alarms['CO2 High'].state = aura_data.CO2.isRecent && aura_data.CO2.value >= 1;
  aura_alarms['CO High'].state = aura_data.CO.isRecent && aura_data.CO.value >= 25;
  aura_alarms['Temp Low'].state = aura_data.Temp.isRecent && aura_data.Temp.value <= 0;
  aura_alarms['Temp High'].state = aura_data.Temp.isRecent && aura_data.Temp.value >= 40;
  aura_alarms['Temp Low'].state |= aura_data.Temp_F.isRecent && aura_data.Temp_F.value <= 32;
  aura_alarms['Temp High'].state |= aura_data.Temp_F.isRecent && aura_data.Temp_F.value >= 104;
  aura_alarms['H2S High'].state = aura_data.H2S.isRecent && aura_data.H2S.value >= 10;

  aura_alarms['NH3 High'].state = aura_data.NH3.isRecent && aura_data.NH3.value >= 50;
  aura_alarms['Cl High'].state = aura_data.Cl.isRecent && aura_data.Cl.value >= 1;
  aura_alarms['NO High'].state = aura_data.NO.isRecent && aura_data.NO.value >= 25;
  aura_alarms['NO2 High'].state = aura_data.NO2.isRecent && aura_data.NO2.value >= 5;
  aura_alarms['CH4 High'].state = aura_data.CH4.isRecent && aura_data.CH4.value >= 40;
  aura_alarms['SO2 High'].state = aura_data.SO2.isRecent && aura_data.SO2.value >= 5;
  aura_alarms['HF High'].state = aura_data.HF.isRecent && aura_data.HF.value >= 3;
  aura_alarms['ClO2 High'].state = aura_data.ClO2.isRecent && aura_data.ClO2.value >= 3;
  aura_alarms['HCL High'].state = aura_data.HCL.isRecent && aura_data.HCL.value >= 3;

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
    H2S: aura_data.H2S.value,
    NH3: aura_data.NH3.value,
    Cl: aura_data.Cl.value,
    NO: aura_data.NO.value,
    NO2: aura_data.NO2.value,
    CH4: aura_data.CH4.value,
    SO2: aura_data.SO2.value,
    HF: aura_data.HF.value,
    ClO2: aura_data.ClO2.value,
    HCL: aura_data.HCL.value,
    Temp_ext: aura_ext_data.Temp.value,
    Temp_F_ext: aura_ext_data.Temp_F.value,
    Humid_ext: aura_ext_data.Humid.value,
    Press_ext: aura_ext_data.Press.value,
    O2_ext: aura_ext_data.O2.value,
    CO2_ext: aura_ext_data.CO2.value,
    CO_ext: aura_ext_data.CO.value,
    H2S_ext: aura_ext_data.H2S.value,
    NH3_ext: aura_ext_data.NH3.value,
    Cl_ext: aura_ext_data.Cl.value,
    NO_ext: aura_ext_data.NO.value,
    NO2_ext: aura_ext_data.NO2.value,
    CH4_ext: aura_ext_data.CH4.value,
    SO2_ext: aura_ext_data.SO2.value,
    HF_ext: aura_ext_data.HF.value,
    ClO2_ext: aura_ext_data.ClO2.value,
    HCL_ext: aura_ext_data.HCL.value,

  }

  db.addMonitorData(5, history_data, function (err, success) {
    if (err)
      return console.log(err.message);
  });
}