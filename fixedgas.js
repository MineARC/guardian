var request = require('request');
var cheerio = require('cheerio');
var jq = require('jquery');
var fs = require('fs');

// Define object for access from where they are needed
var fgm_data = {};
exports.fgm_data = fgm_data;

// Spin up polling of backend services
var fgm_is_polling = true;
poll_fgm(function () {
  exports.fgm_data = fgm_data;
  fgm_is_polling = false;
});
setInterval(function () {
  if (!fgm_is_polling) {
    fgm_is_polling = true;
    poll_fgm(function () {
      exports.fgm_data = fgm_data;
      fgm_is_polling = false;
    });
  }
}, 5000);

function poll_fgm(next) {
  var request_options = {
    url: 'http://localhost:8003/',
    proxy: ''
  };

  request.get(request_options, function (err, res, body) {
    if (!err && (res.statusCode == 200 || res.statusCode == 304)) {
      processPage(body);
      next();
    }
  });
}

function processPage(data) {
  jq = cheerio.load(data);

  // Create an object to store the status
  var system = {};

  var gasses = [];
  var gas_name = '';
  var gas_value = '';

  // Itterate over each of the alarms so they can be added
  jq('p').each(function (index, element) {
    // Name is the label that shows for each error
    gas_name = jq(element).text().trim().split(': ')[0];
    // If the alarm isnt hidden this will resolve to true
    gas_value = jq(element).text().trim().split(': ')[1];
    // Add the alarms to the object
    gasses.push({ 'gas_name': gas_name, 'gas_value': gas_value });
  });

  system['gasses'] = gasses;

  fgm_data = system;
}
