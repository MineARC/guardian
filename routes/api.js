var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var jq = require('jquery');
var fs = require('fs');
var router = express.Router();

function render_error(res, err) {
    console.log(err);
    // If there is an error render it for display to the user
    return res.render('error', {
        error: err
    });
}

/* GET api json for S4 system name, mode, and info */
router.get('/monitor/system', function (req, res, next) {
    //TODO replace file reader with real http request
    // var request_options = {
    // url: 'http://192.168.16.200/',
    // proxy: ''
    // };

    // request.get(request_options, function (err, res, body) {
    // if (!err && res.statusCode == 200) {
    // console.log(err);
    // return res.render('error', {
    // message: err.message,
    // error: err
    // });
    // }
    // })

    // Using file reader for testing purposes
    fs.readFile('Refuge Chamber.html', 'utf8', function (err, data) {
        if (err) {
            return render_error(res, err);
        }

        // Load the document into jQuery
        jq = cheerio.load(data);

        // Create an object to store the status
        var status = {};
        var status_name = '';
        var status_info = '';

        // First add the name gotten from the top of the document
        try {
            status['name'] = jq('b:contains(Chamber name:)').next().html().toLowerCase();
        } catch (error) {
            console.log('Failed to get chamber name');
            return render_error(res, error);
        }

        // Second add the mode gotten from the top of the document
        status['mode'] = jq('p > span:not(.hide   )').html().toLowerCase();

        // Itterate over each of the elements in the table so they can be added to status
        jq('table.status').find('td.left').each(function (index, element) {
            // Name is found by the bold subchild
            status_name = jq(element).find('b').html().toLowerCase();
            if (status_name == 'system')
                // Standardise some of the names that contain html tags and other characters
                status_name = status_name.replace(/<(?:.|\n)*?>/g, '').replace(/:/g, '').trim();
            // Info is found in the next column over
            status_info = jq(element).next().html();
            if (status_info != null) {
                // Only care about numbers, sign, and decimal point
                status_info = status_info.match(/[-+0-9.]+/g)[0]
            }
            // Add the info to the object
            status[status_name] = status_info;
        });

        console.log(status);

        // Return the alarms as a JSON object
        res.setHeader('content-type', 'application/json');
        res.json(status);
    });
});

/* GET api json for S4 alamrs */
router.get('/monitor/alarms', function (req, res, next) {
    //TODO replace file reader with real http request
    // var request_options = {
    // url: 'http://192.168.16.200/minearc.png',
    // proxy: ''
    // };

    // request.get(request_options, function (err, res, body) {
    // if (!err && res.statusCode == 200) {
    // console.log(err);
    // return res.render('error', {
    // message: err.message,
    // error: err
    // });
    // }
    // })

    // Using file reader for testing purposes
    fs.readFile('Refuge Chamber.html', 'utf8', function (err, data) {
        if (err) {
            return render_error(res, err);
        }
        // Load the document into jQuery
        jq = cheerio.load(data);

        // Create an object to store the alarms
        var alarms = {};
        var error_name = '';
        var error_status = false;
        // Itterate over each of the alarms so they can be added
        jq('#alarms > p').each(function (index, element) {
            // Name is the label that shows for each error
            error_name = jq(element).html().toLowerCase().trim();
            // If the alarm isnt hidden this will resolve to true
            error_status = !jq(element).hasClass('hide   ');
            // Add the alarms to the object
            alarms[error_name] = error_status;
        });

        console.log(alarms);

        // Return the alarms as a JSON object
        res.setHeader('content-type', 'application/json');
        res.json(alarms);
    });
});



module.exports = router;
