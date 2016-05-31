var request = require('request');
var cheerio = require('cheerio');
var jq = require('jquery');
var fs = require('fs');

// Define object for access from where they are needed
var monitor_data = '';
exports.monitor_data = monitor_data;

// Spin up polling of backend services
var monitor_is_polling = true;
poll_monitor(function () {
  exports.monitor_data = monitor_data;
  monitor_is_polling = false;
});
setInterval(function () {
  if (!monitor_is_polling) {
    monitor_is_polling = true;
    poll_monitor(function () {
      exports.monitor_data = monitor_data;
      monitor_is_polling = false;
    });
  }
}, 5000);

function poll_monitor(next) {
  // var request_options = {
  //     url: 'http://192.168.17.200/',
  //     proxy: ''
  // };

  // request.get(request_options, function (err, res, body) {
  //     if (!err && res.statusCode == 200) {
  //         monitor_data = body;
  //     }
  //     // Call the callback funtion to manage passing of the data
  //     // and to restart the polling
  //     next();
  // });

  // Using file reader during testing with monitor off
  fs.readFile('Refuge Chamber.html', 'utf8', function (err, data) {
    if (err) {
      console.log('something went wrong in the polling service');
    }

    jq = cheerio.load(data);

    // Create an object to store the status
    var system = {};
    var section = '';
    var section_enabled = true;
    var rows = [];

    var row_name = '';
    var row_info = '';

    // First add the name gotten from the top of the document
    // Use html() and and not text() so that we can seperate the bold text
    var name = jq('b:contains(Chamber name:)').parent().html();
    name = name.toLowerCase().replace(/<(?:.|\n)*>/g, '').trim();
    system['name'] = name;

    // Second add the mode gotten from the top of the document
    var mode = jq('p > span:not(.hide)').text().toLowerCase();
    mode = capitalizeFirstLetter(mode);
    system['mode'] = mode

    // Itterate over each of the elements in the table so they can be added to status
    jq('table.status').find('td.left').each(function (index, element) {
      // Name is found by the bold subchild
      row_name = jq(element).find('b').text().toLowerCase();

      // Standardise some of the names that contain html tags and other characters
      row_name = row_name.replace(/:/g, '').trim();
      row_name = capitalizeFirstLetter(row_name);
      //system_name = system_name.replace(/<(?:.|\n)*?>/g, '').replace(/:/g, '').trim();

      // Info is found in the next column over
      // Use html() here also for reasons
      row_info = jq(element).next().html();
      if (row_info != null) {
        // Only care about numbers, sign, and decimal point
        row_info = row_info.match(/[-+0-9.]+/g)[0]
      }

      if (row_name == 'System information') {
        section = 'system_information';
        section_enabled = !jq(element).parent().hasClass('hide');
        return true
      }
      else if (row_name == 'Fan board 1') {
        if (section_enabled) {
          system[section] = rows;
        }
        section = 'fan_board_1';
        rows = [];
        section_enabled = !jq(element).parent().hasClass('hide');
        return true;
      }
      else if (row_name == 'Fan board 2') {
        if (section_enabled) {
          system[section] = rows;
        }
        section = 'fan_board_2';
        rows = [];
        section_enabled = !jq(element).parent().hasClass('hide');
        return true;
      }
      else if (row_name == 'Current loops') {
        if (section_enabled) {
          system[section] = rows;
        }
        section = 'current_loops';
        rows = [];
        section_enabled = !jq(element).parent().hasClass('hide');
        return true;
      }
      else {
        // Add the info to the object
        rows.push({ 'row_name': row_name, 'row_info': row_info });
      }
    });

    if (section_enabled) {
      system[section] = rows;
    }

    // Create an object to store the alarms
    var alarms = [];
    var alarm_name = '';
    var alarm_status = false;
    // Itterate over each of the alarms so they can be added
    jq('#alarms > p').each(function (index, element) {
      // Name is the label that shows for each error
      alarm_name = jq(element).text().toLowerCase().trim();
      alarm_name = capitalizeFirstLetter(alarm_name);
      // If the alarm isnt hidden this will resolve to true
      alarm_status = !jq(element).hasClass('hide');
      // Add the alarms to the object
      alarms.push({ 'alarm_name': alarm_name, 'alarm_status': alarm_status });
    });

    system['alarms'] = alarms;

    monitor_data = system;

    // Call the callback funtion to manage passing of the data
    // and to restart the polling
    next();
  });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

