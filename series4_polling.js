var request = require('request');
var cheerio = require('cheerio');
var jq = require('jquery');
var fs = require('fs');
var db = require('./database');
var jumpers = require('./jumpers');

setInterval(poll_database, 10000);
poll_database();

function poll_database() {
  db.getMonitorData(3, function (err, data) {
    if (err) {
      return console.log(err.message);
    }
    exports.history = data;
  });
}

// Define object for access from where they are needed
var series4_alarms = {
  'SDCard failed on Display board': { state: false, type: 'series4' },
  'Internal log is full': { state: false, type: 'series4' },
  'Battery Rail has failed on Display board': { state: false, type: 'series4' },
  'SMPS Rail has failed on Display board': { state: false, type: 'series4' },
  'Fan board 1 has failed': { state: false, type: 'series4' },
  'Battery Rail has failed on Fan board 1': { state: false, type: 'series4' },
  'SMPS Rail has failed on Fan board 1': { state: false, type: 'series4' },
  'CO2 fan 1 has failed on Fan board 1': { state: false, type: 'series4' },
  'CO2 fan 2 has failed on Fan board 1': { state: false, type: 'series4' },
  'CO fan has failed on Fan board 1': { state: false, type: 'series4' },
  'Lighting has failed on Fan board 1': { state: false, type: 'series4' },
  'Siren has failed on Fan board 1': { state: false, type: 'series4' },
  'Green strobe light has failed on Fan board 1': { state: false, type: 'series4' },
  'Red strobe light has failed on Fan board 1': { state: false, type: 'series4' },
  'Yellow strobe light has failed on Fan board 1': { state: false, type: 'series4' },
  'Fan board 2 has failed': { state: false, type: 'series4' },
  'Battery Rail has failed on Fan board 2': { state: false, type: 'series4' },
  'SMPS Rail has failed on Fan board 2': { state: false, type: 'series4' },
  'CO2 fan 1 has failed on Fan board 2': { state: false, type: 'series4' },
  'CO2 fan 2 has failed on Fan board 2': { state: false, type: 'series4' },
  'CO fan has failed on Fan board 2': { state: false, type: 'series4' },
  'Lighting has failed on Fan board 2': { state: false, type: 'series4' },
  'Siren has failed on Fan board 2': { state: false, type: 'series4' },
  'Green strobe light has failed on Fan board 2': { state: false, type: 'series4' },
  'Red strobe light has failed on Fan board 2': { state: false, type: 'series4' },
  'Yellow strobe light has failed on Fan board 2': { state: false, type: 'series4' },
  'Current board has failed': { state: false, type: 'series4' },
  'Battery Rail has failed on Current board': { state: false, type: 'series4' },
  'SMPS Rail has failed on Current board': { state: false, type: 'series4' },
  'Current Loop 1 has failed': { state: false, type: 'series4' },
  'Current Loop 2 has failed': { state: false, type: 'series4' },
  'Current Loop 3 has failed': { state: false, type: 'series4' },
  'Current Loop 4 has failed': { state: false, type: 'series4' },
  'Current Loop 5 has failed': { state: false, type: 'series4' },
  'Current Loop 6 has failed': { state: false, type: 'series4' },
  'Voice board has failed': { state: false, type: 'series4' },
  'Battery Rail has failed on Voice board': { state: false, type: 'series4' },
  'SMPS Rail has failed on Voice board': { state: false, type: 'series4' },
  'SDCard has failed on Voice board': { state: false, type: 'series4' },
  'Speaker failed': { state: false, type: 'series4' },
  'General board has failed': { state: false, type: 'series4' },
  'Battery Rail has failed on General board': { state: false, type: 'series4' },
  'SMPS Rail has failed on General board': { state: false, type: 'series4' },
  'Chamber temperature failed': { state: false, type: 'series4' },
  'Outside temperature failed': { state: false, type: 'series4' },
  'Mains power has been disconnected': { state: false, type: 'series4' },
  'Inverter voltage has failed': { state: false, type: 'series4' },
  'Inverter fault signal has been detected': { state: false, type: 'series4' },
  'Battery board has failed': { state: false, type: 'series4' },
  'Battery power is unavailable': { state: false, type: 'series4' },
  'Battery discharge current failed': { state: false, type: 'series4' },
  'Battery charge current failed': { state: false, type: 'series4' },
  'Battery voltage failed': { state: false, type: 'series4' },
  'Battery temperature failed': { state: false, type: 'series4' },
  'Battery current failed': { state: false, type: 'series4' },
  'Load Test has failed': { state: false, type: 'series4' }
};
var series4_data = {
  name: 'Not Found',
  mode: 'Not Found',
  system_information: [],
  fan_board_1: []
};

exports.data = series4_data;
exports.alarms = series4_alarms;

// Spin up polling of backend services
setInterval(poll_monitor, 10000);
poll_monitor();

function poll_monitor() {
  var request_options = {
    url: 'http://localhost/pt/monitor/',
    proxy: ''
  };

  request.get(request_options, function (err, res, body) {
    if (!err && (res.statusCode == 200 || res.statusCode == 304)) {
      processPage(body);
    }
  });
}

function processPage(data) {
  jq = cheerio.load(data);

  // Create an object to store the status
  var section = '';
  var section_enabled = true;
  var rows = [];

  var row_name = '';
  var row_info = '';
  var row_unit = '';

  // First add the name gotten from the top of the document
  // Use html() and and not text() so that we can seperate the bold text
  var name = jq('b:contains(Chamber name:)').parent().html();
  name = name.replace(/<(?:.|\n)*>/g, '').trim();
  series4_data['name'] = name;

  // Second add the mode gotten from the top of the document
  var mode = jq('p > span:not(.hide)').text();
  series4_data['mode'] = mode

  // Itterate over each of the elements in the table so they can be added to status
  jq('table.status').find('td.left').each(function (index, element) {
    // Name is found by the bold subchild
    row_name = jq(element).find('b').text();

    // Standardise some of the names that contain html tags and other characters
    row_name = row_name.replace(/:/g, '').trim();
    //system_name = system_name.replace(/<(?:.|\n)*?>/g, '').replace(/:/g, '').trim();

    // Info is found in the next column over
    // Use html() here also for reasons
    row_info = jq(element).next().html();
    if (row_info != null) {
      row_unit = row_info.match(/(V|A|C|F|ppm|%)/g);
      if (row_unit)
        row_unit = row_unit[row_unit.length - 1];
      // Only care about numbers, sign, and decimal point
      row_info = parseFloat(row_info.match(/[-+0-9.]+/g)[0]);
      if (jumpers.localize == 'us' && row_unit == 'C') {
        row_info = ((row_info * 9 / 5) + 32).toFixed(1);
        row_unit = 'F';
      } else if (row_unit == 'F') {
        row_unit = 'C';
      }
    }

    if (row_name.toLowerCase() == 'system information') {
      section = 'system_information';
      section_enabled = !jq(element).parent().hasClass('hide');
      return true
    }
    else if (row_name.toLowerCase() == 'fan board 1') {
      if (section_enabled) {
        series4_data[section] = rows;
      }
      section = 'fan_board_1';
      rows = [];
      section_enabled = !jq(element).parent().hasClass('hide');
      return true;
    }
    else if (row_name.toLowerCase() == 'fan board 2') {
      if (section_enabled) {
        series4_data[section] = rows;
      }
      section = 'fan_board_2';
      rows = [];
      section_enabled = !jq(element).parent().hasClass('hide');
      return true;
    }
    else if (row_name.toLowerCase() == 'current loops') {
      if (section_enabled) {
        series4_data[section] = rows;
      }
      section = 'current_loops';
      rows = [];
      section_enabled = !jq(element).parent().hasClass('hide');
      return true;
    }
    else {
      // Add the info to the object
      rows.push({ 'row_name': row_name, 'row_info': row_info, 'row_unit': row_unit });
    }
  });

  if (section_enabled) {
    series4_data[section] = rows;
  }

  // Create an object to store the alarms
  var alarm_name = '';
  var alarm_status = false;
  // Itterate over each of the alarms so they can be added
  jq('#alarms > p').each(function (index, element) {
    // Name is the label that shows for each error
    alarm_name = jq(element).text().trim();
    // If the alarm isnt hidden this will resolve to true
    alarm_status = !jq(element).hasClass('hide');
    // Add the alarms to the object
    if (alarm_name in series4_alarms) {
      series4_alarms[alarm_name].state = alarm_status;
    }
  });

  var graph_data = {
    voltage_mains: parseFloat(series4_data.system_information[0].row_info),
    voltage_battery: parseFloat(series4_data.system_information[1].row_info),
    voltage_inverter: parseFloat(series4_data.system_information[2].row_info),
    temp_internal: parseFloat(series4_data.system_information[5].row_info),
    temp_external: parseFloat(series4_data.system_information[6].row_info),
    temp_battery: parseFloat(series4_data.system_information[4].row_info),
    current_battery: parseFloat(series4_data.system_information[3].row_info),
  }

  db.addMonitorData(3, graph_data, function (err, success) {
    if (err)
      return console.log(err.message);
  });
}