var request = require('request');
var cheerio = require('cheerio');
var jq = require('jquery');
var fs = require('fs');
var db = require('./database');

// Define object for access from where they are needed
var series4_alarms = {
  'SDCard failed on Display board': { state: false },
  'Internal log is full': { state: false },
  'Battery Rail has failed on Display board': { state: false },
  'SMPS Rail has failed on Display board': { state: false },
  'Fan board 1 has failed': { state: false },
  'Battery Rail has failed on Fan board 1': { state: false },
  'SMPS Rail has failed on Fan board 1': { state: false },
  'CO2 fan 1 has failed on Fan board 1': { state: false },
  'CO2 fan 2 has failed on Fan board 1': { state: false },
  'CO fan has failed on Fan board 1': { state: false },
  'Lightining has failed on Fan board 1': { state: false },
  'Siren has failed on Fan board 1': { state: false },
  'Green strobe light has failed on Fan board 1': { state: false },
  'Red strobe light has failed on Fan board 1': { state: false },
  'Yellow strobe light has failed on Fan board 1': { state: false },
  'Fan board 2 has failed': { state: false },
  'Battery Rail has failed on Fan board 2': { state: false },
  'SMPS Rail has failed on Fan board 2': { state: false },
  'CO2 fan 1 has failed on Fan board 2': { state: false },
  'CO2 fan 2 has failed on Fan board 2': { state: false },
  'CO fan has failed on Fan board 2': { state: false },
  'Lightining has failed on Fan board 2': { state: false },
  'Siren has failed on Fan board 2': { state: false },
  'Green strobe light has failed on Fan board 2': { state: false },
  'Red strobe light has failed on Fan board 2': { state: false },
  'Yellow strobe light has failed on Fan board 2': { state: false },
  'Current board has failed': { state: false },
  'Battery Rail has failed on Current board': { state: false },
  'SMPS Rail has failed on Current board': { state: false },
  'Current Loop 1 has failed': { state: false },
  'Current Loop 2 has failed': { state: false },
  'Current Loop 3 has failed': { state: false },
  'Current Loop 4 has failed': { state: false },
  'Current Loop 5 has failed': { state: false },
  'Current Loop 6 has failed': { state: false },
  'Voice board has failed': { state: false },
  'Battery Rail has failed on Voice board': { state: false },
  'SMPS Rail has failed on Voice board': { state: false },
  'SDCard has failed on Voice board': { state: false },
  'Speaker failed': { state: false },
  'General board has failed': { state: false },
  'Battery Rail has failed on General board': { state: false },
  'SMPS Rail has failed on General board': { state: false },
  'Chamber temperature failed': { state: false },
  'Outside temperature failed': { state: false },
  'Mains power has been disconnected': { state: false },
  'Inverter voltage has failed': { state: false },
  'Inverter fault signal has been detected': { state: false },
  'Battery board has failed': { state: false },
  'Battery power is unavailable': { state: false },
  'Battery discharge current failed': { state: false },
  'Battery charge current failed': { state: false },
  'Battery voltage failed': { state: false },
  'Battery temperature failed': { state: false },
  'Battery current failed': { state: false },
  'Load Test has failed': { state: false }
};
var series4_data = {
  name: 'Not Found',
  mode: 'Not Found',
  system_information: [],
  fan_board_1: [],
  alarms: series4_alarms,
  alarms_total: 0
};

exports.data = series4_data;

// Spin up polling of backend services
var monitor_is_polling = true;
poll_monitor(function () {
  monitor_is_polling = false;
});
setInterval(function () {
  if (!monitor_is_polling) {
    monitor_is_polling = true;
    poll_monitor(function () {
      monitor_is_polling = false;
    });
  }
}, 5000);

function poll_monitor(next) {
  var request_options = {
    url: 'http://localhost/pt/monitor/',
    proxy: ''
  };

  request.get(request_options, function (err, res, body) {
    if (!err && (res.statusCode == 200 || res.statusCode == 304)) {
      processPage(body);
      next();
    } else {
      // Using file reader during testing with monitor off
      fs.readFile('series4.html', 'utf8', function (err, data) {
        if (err) {
          console.log('something went wrong in the polling service');
          return next();
        }
        processPage(data);
        next();
      });
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
      // console.log(row_info);
      row_unit = row_info.match(/(V|A|C|F|ppm)$/g);
      if (row_unit)
        row_unit = row_unit[0];
      // Only care about numbers, sign, and decimal point
      row_info = parseFloat(row_info.match(/[-+0-9.]+/g)[0]);
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
  var alarms_total = 0;
  // Itterate over each of the alarms so they can be added
  jq('#alarms > p').each(function (index, element) {
    // Name is the label that shows for each error
    alarm_name = jq(element).text().trim();
    // If the alarm isnt hidden this will resolve to true
    alarm_status = !jq(element).hasClass('hide');
    // Add the alarms to the object
    if (alarm_name in series4_data.alarms) {
      series4_data.alarms[alarm_name].status = alarm_status;
      if (alarm_status)
        alarms_total++;
    }
  });
  series4_data.alarms_total = alarms_total;

  db.addMonitorData(3, series4_data, function (err, success) {
    if (err)
      return console.log(err.message);
  });
}