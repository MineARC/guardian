var request = require('request');
var cheerio = require('cheerio');
var jq = require('jquery');
var fs = require('fs');

// Define object for access from where they are needed
var series3_alarms = {
  'Mains power has been disconnected': { state: false },
  'Transformer has failed': { state: false },
  'Battery temperature is outside safe limits': { state: false },
  'Chamber temperature is outside safe limits': { state: false },
  'Outside temperature is outside safe limits': { state: false },
  'Fluorescent lighting has failed': { state: false },
  'CO2 fan has failed': { state: false },
  'CO fan has failed': { state: false },
  'Red strobe light has failed': { state: false },
  'Inverter current is outside safe limits': { state: false },
  'Green strobe light has failed': { state: false },
  'Siren has failed': { state: false },
  'Inverter DC voltage is outside safe limits': { state: false },
  'Loading self-test has failed': { state: false },
  'Battery was not available during self-test': { state: false },
  'Inverter AC voltage is outside safe limits': { state: false },
  'SD card has been removed': { state: false },
  'Low free storage space on EEPROM for logging': { state: false },
  'Inverter has failed': { state: false },
};
var series3_data = {
  name: 'Not Found',
  mode: 'Not Found',
  raw: [],
  alarms: series3_alarms,
  alarms_total: 0
};

exports.data = series3_data;

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
      fs.readFile('series3.html', 'utf8', function (err, data) {
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
  var rows = [];

  var row_name = '';
  var row_info = '';

  // First add the name gotten from the top of the document
  // Use html() and and not text() so that we can seperate the bold text
  var name = jq('b:contains(Chamber name:)').parent().html();
  name = name.replace(/<(?:.|\n)*>/g, '').trim();
  series3_data['name'] = name;

  // Second add the mode gotten from the top of the document
  var mode = jq('p > span:not(.hide)').text();
  series3_data['mode'] = mode

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
      row_unit = row_info.match(/(V|mA|A|C|F|ppm)$/g);
      if (row_unit)
        row_unit = row_unit[0];
      // Only care about numbers, sign, and decimal point
      row_info = parseFloat(row_info.match(/[-+0-9.]+/g)[0]);
    }

    // Add the info to the object
    rows.push({ 'row_name': row_name, 'row_info': row_info, 'row_unit': row_unit });
  });

  series3_data.raw = rows;

  // Create an object to store the alarms
  var alarm_name = '';
  var alarm_status = false;
  var alarms_total = 0;
  // Itterate over each of the alarms so they can be added
  jq('#alarms > p').each(function (index, element) {
    // Name is the label that shows for each error
    alarm_name = jq(element).text().trim();
    console.log(alarm_name);
    // If the alarm isnt hidden this will resolve to true
    alarm_status = !jq(element).hasClass('hide');
    // Add the alarms to the object
    if (alarm_name in series3_data.alarms) {
      series3_data.alarms[alarm_name].state = alarm_status;
      if (alarm_status)
        alarms_total++;
    }
  });
  series3_data.alarms_total = alarms_total;

  db.addMonitorData(2, series3_data, function (err, success) {
    if (err)
      return console.log(err.message);
  });
}