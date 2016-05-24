var express = require('express');
var cheerio = require('cheerio');
var jq = require('jquery');
var polling = require('../polling');
var router = express.Router();

function render_error(res, err) {
  console.log(err);
  // If there is an error render it for display to the user
  return res.render('error', {
    error: err
  });
}

/* GET api json for S4 system name, mode, and info */
router.get('/system', function (req, res, next) {
  // Get document from polling service
  var data = polling.monitor_data;

  // Create an object to store the status
  var system = {};
  var rows = [];

  try {
    // Load the document into jQuery
    jq = cheerio.load(data);


    var row_name = '';
    var row_info = '';

    var continue_past = true;

    // First add the name gotten from the top of the document
    // Use html() and and not text() so that we can seperate the bold text
    var name = jq('b:contains(Chamber name:)').parent().html();
    name = name.toLowerCase().replace(/<(?:.|\n)*>/g, '').trim();
    system['name'] = name;

    // Second add the mode gotten from the top of the document
    system['mode'] = jq('p > span:not(.hide)').text().toLowerCase();

    // Itterate over each of the elements in the table so they can be added to status
    jq('table.status').find('td.left').each(function (index, element) {
      // Name is found by the bold subchild
      row_name = jq(element).find('b').text().toLowerCase();

      // Standardise some of the names that contain html tags and other characters
      row_name = row_name.replace(/:/g, '').trim();
      //system_name = system_name.replace(/<(?:.|\n)*?>/g, '').replace(/:/g, '').trim();

      // Info is found in the next column over
      // Use html() here also for reasons
      row_info = jq(element).next().html();
      if (row_info != null) {
        // Only care about numbers, sign, and decimal point
        row_info = row_info.match(/[-+0-9.]+/g)[0]
      }

      if (row_name == 'system information') {
        // This is just a header
        // Do nothing
      }
      else if (row_name == 'fan board 1') {
        // Done with this section
        return false;
      }
      else {
        // Add the info to the object
        rows.push({ 'row_name': row_name, 'row_info': row_info });
      }
    });

    system['rows'] = rows;

  } catch (error) {
    console.log('Something has gone wrong parsing the system api');
    return render_error(res, error);
  }

  // Return the alarms as a JSON object
  res.header('content-type', 'application/json');
  res.json(system);
});

/* GET api json for S4 fan board 1 */
router.get('/fanboard1', function (req, res, next) {
  // Get document from polling service
  var data = polling.monitor_data;

  // Create an object to store the status
  var fanboard1 = {};
  var rows = [];

  try {
    // Load the document into jQuery
    jq = cheerio.load(data);

    var row_name = '';
    var row_info = '';

    var continue_past = true;

    // Itterate over each of the elements in the table so they can be added to status
    jq('table.status').find('td.left').each(function (index, element) {
      // Name is found by the bold subchild
      row_name = jq(element).find('b').text().toLowerCase();

      // Standardise some of the names that contain html tags and other characters
      row_name = row_name.replace(/<(?:.|\n)*?>/g, '').replace(/:/g, '').trim();

      // Skip past all the stuff before what we care about
      if (row_name == 'fan board 1') {
        // Add to the api the state of the table (shown/hiden)
        row_info = !jq(element).parent().hasClass('hide');
        fanboard1['enabled'] = row_info;

        continue_past = false;
        return true;
      }
      else if (continue_past) {
        return true;
      }

      // Info is found in the next column over
      // Use html() here also for reasons
      row_info = jq(element).next().html();
      if (row_info != null) {
        // Only care about numbers, sign, and decimal point
        row_info = row_info.match(/[-+0-9.]+/g)[0]
      }

      if (row_name == 'fan board 2') {
        // Done with this section
        return false;
      }
      else {
        // Add the info to the object
        rows.push({ 'row_name': row_name, 'row_info': row_info });
      }
    });

    fanboard1['rows'] = rows;

  } catch (error) {
    console.log('Something has gone wrong parsing the fan board 1');
    return render_error(res, error);
  }

  // Return the alarms as a JSON object
  res.header('content-type', 'application/json');
  res.json(fanboard1);
});

/* GET api json for S4 fan board 2 */
router.get('/fanboard2', function (req, res, next) {
  // Get document from polling service
  var data = polling.monitor_data;

  // Create an object to store the status
  var fanboard2 = {};
  var rows = [];

  try {
    // Load the document into jQuery
    jq = cheerio.load(data);

    var row_name = '';
    var row_info = '';

    var continue_past = true;

    // Itterate over each of the elements in the table so they can be added to status
    jq('table.status').find('td.left').each(function (index, element) {
      // Name is found by the bold subchild
      row_name = jq(element).find('b').text().toLowerCase();

      // Standardise some of the names that contain html tags and other characters
      row_name = row_name.replace(/<(?:.|\n)*?>/g, '').replace(/:/g, '').trim();

      // Skip past all the stuff before what we care about
      if (row_name == 'fan board 2') {
        // Add to the api the state of the table (shown/hiden)
        row_info = !jq(element).parent().hasClass('hide');
        fanboard2['enabled'] = row_info;

        continue_past = false;
        return true;
      }
      else if (continue_past) {
        return true;
      }

      // Info is found in the next column over
      // Use html() here also for reasons
      row_info = jq(element).next().html();
      if (row_info != null) {
        // Only care about numbers, sign, and decimal point
        row_info = row_info.match(/[-+0-9.]+/g)[0]
      }

      if (row_name == 'current loops') {
        // Done with this section
        return false;
      }
      else {
        // Add the info to the object
        rows.push({ 'row_name': row_name, 'row_info': row_info });
      }

    });

    fanboard2['rows'] = rows;

  } catch (error) {
    console.log('Something has gone wrong parsing the fan board 2');
    return render_error(res, error);
  }

  // Return the alarms as a JSON object
  res.header('content-type', 'application/json');
  res.json(fanboard2);
});

/* GET api json for S4 current loops */
router.get('/currentloops', function (req, res, next) {
  // Get document from polling service
  var data = polling.monitor_data;

  // Create an object to store the status
  var currentloops = {};
  var rows = [];

  try {
    // Load the document into jQuery
    jq = cheerio.load(data);

    var row_name = '';
    var row_info = '';

    var continue_past = true;

    // Itterate over each of the elements in the table so they can be added to status
    jq('table.status').find('td.left').each(function (index, element) {
      // Name is found by the bold subchild
      row_name = jq(element).find('b').text().toLowerCase();

      // Standardise some of the names that contain html tags and other characters
      row_name = row_name.replace(/<(?:.|\n)*?>/g, '').replace(/:/g, '').trim();

      // Skip past all the stuff before what we care about
      if (row_name == 'current loops') {
        // Add to the api the state of the table (shown/hiden)
        row_info = !jq(element).parent().hasClass('hide');
        currentloops['enabled'] = row_info;

        continue_past = false;
        return true;
      }
      else if (continue_past) {
        return true;
      }

      // Info is found in the next column over
      // Use html() here also for reasons
      row_info = jq(element).next().html();
      if (row_info != null) {
        // Only care about numbers, sign, and decimal point
        row_info = row_info.match(/[-+0-9.]+/g)[0]
      }

      // Add the info to the object
      rows.push({ 'row_name': row_name, 'row_info': row_info });
    });

    currentloops['rows'] = rows;

  } catch (error) {
    console.log('Something has gone wrong parsing the current loops');
    return render_error(res, error);
  }

  // Return the alarms as a JSON object
  res.header('content-type', 'application/json');
  res.json(currentloops);

});

/* GET api json for S4 alarms */
router.get('/alarms', function (req, res, next) {
  // Get document from polling service
  var data = polling.monitor_data;

  // Create an object to store the alarms
  var alarms = [];

  try {
    // Load the document into jQuery
    jq = cheerio.load(data);


    var alarm_name = '';
    var alarm_status = false;
    // Itterate over each of the alarms so they can be added
    jq('#alarms > p').each(function (index, element) {
      // Name is the label that shows for each error
      alarm_name = jq(element).text().toLowerCase().trim();
      // If the alarm isnt hidden this will resolve to true
      alarm_status = !jq(element).hasClass('hide');
      // Add the alarms to the object
      alarms.push({ 'alarm_name': alarm_name, 'alarm_status': alarm_status });
    });

  } catch (error) {
    console.log('Something has gone wrong parsing the alarms api');
    return render_error(res, error);
  }

  // Return the alarms as a JSON object
  res.header('content-type', 'application/json');
  res.json(alarms);

});

module.exports = router;
