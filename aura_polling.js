var request = require('request');
var cheerio = require('cheerio');
var jq = require('jquery');
var fs = require('fs');

// Define object for access from where they are needed
var timestamps = {
  Temp: 0,
  Humid: 0,
  Press: 0,
  O2: 0,
  CO2: 0,
  CO: 0,
}
var aura_alarms = {
  'Oxygen Low': { state: false },
  'Oxygen High': { state: false }
}
var aura_data = {
  Temp: { value: 0, unit: 'C' },
  Humid: { value: 0, unit: '%' },
  Press: { value: 0, unit: 'hPa' },
  O2: { value: 0, unit: '%' },
  CO2: { value: 0, unit: 'ppm' },
  CO: { value: 0, unit: 'ppm' },
  alarms: aura_alarms,
  alarms_total: 0
};
exports.data = aura_data;

// Spin up polling of backend services
var aura_is_polling = true;
poll_aura(function () {
  aura_is_polling = false;
});
setInterval(function () {
  if (!aura_is_polling) {
    aura_is_polling = true;
    poll_aura(function () {
      aura_is_polling = false;
    });
  }
}, 5000);

function poll_aura(next) {
  var request_options = {
    url: 'http://localhost/pt/aura/',
    proxy: ''
  };

  request.get(request_options, function (err, res, body) {
    if (!err && (res.statusCode == 200 || res.statusCode == 304)) {
      processPage(body);
      updateAlarms();
      next();
      exports.data = aura_data;
    }
  });
}

function processPage(data) {
  jq = cheerio.load(data);

  // Create an object to store the status
  var gas_name = '';
  var gas_value = '';
  var gas_unit = '';

  jq('tr').each(function (index, element) {
    gas_name = jq(element).find('td').first().text();
    gas_value = jq(element).find('td').first().next().text();
    if (gas_name in aura_data) {
      aura_data[gas_name].value = gas_value;
      timestamps[gas_name] = Date.now();
    }
  });
}

function updateAlarms() {

}
