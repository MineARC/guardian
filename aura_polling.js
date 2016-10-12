var request = require('request');
var cheerio = require('cheerio');
var jq = require('jquery');
var fs = require('fs');

var aura_alarms = {
  'Oxygen Low': { state: false, type: 'aura' },
  'Oxygen High': { state: false, type: 'aura' }
}

var aura_data = {
  Temp: { value: 0, unit: 'C', timestamp: 0 },
  Humid: { value: 0, unit: '%', timestamp: 0 },
  Press: { value: 0, unit: 'hPa', timestamp: 0 },
  O2: { value: 0, unit: '%', timestamp: 0 },
  CO2: { value: 0, unit: '%', timestamp: 0 },
  CO: { value: 0, unit: 'ppm', timestamp: 0 },
};

exports.data = aura_data;
exports.alarms = aura_alarms;

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
      aura_data[gas_name].timestamp = Date.now();
    }
  });
}

function updateAlarms() {

}
