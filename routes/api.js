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
    //     url: 'http://192.168.16.200/',
    //     proxy: ''
    // };

    // request.get(request_options, function (err, res, body) {
    //     if (!err && res.statusCode == 200) {
    //     }
    // })

    // Using file reader for testing purposes
    fs.readFile('Refuge Chamber.html', 'utf8', function (err, data) {
        if (err) {
            return render_error(res, err);
        }

        try {
            // Load the document into jQuery
            jq = cheerio.load(data);

            // Create an object to store the status
            var system = {};
            var system_name = '';
            var system_info = '';

            var continue_past = true;

            // First add the name gotten from the top of the document
            // Use html() and and not text() so that we can seperate the bold text
            system_info = jq('b:contains(Chamber name:)').parent().html();
            system_info = system_info.toLowerCase().replace(/<(?:.|\n)*>/g, '').trim();
            system['name'] = system_info;

            // Second add the mode gotten from the top of the document
            system['mode'] = jq('p > span:not(.hide)').text().toLowerCase();

            // Itterate over each of the elements in the table so they can be added to status
            jq('table.status').find('td.left').each(function (index, element) {
                // Name is found by the bold subchild
                system_name = jq(element).find('b').text().toLowerCase();

                // Standardise some of the names that contain html tags and other characters
                system_name = system_name.replace(/:/g, '').trim();
                //system_name = system_name.replace(/<(?:.|\n)*?>/g, '').replace(/:/g, '').trim();

                // Info is found in the next column over
                // Use html() here also for reasons
                system_info = jq(element).next().html();
                if (system_info != null) {
                    // Only care about numbers, sign, and decimal point
                    system_info = system_info.match(/[-+0-9.]+/g)[0]
                }

                if (system_name == 'system information') {
                    // This is just a header
                    // Do nothing
                }
                else if (system_name == 'fan board 1') {
                    // Done with this section
                    return false;
                }
                else {
                    // Add the info to the object
                    system[system_name] = system_info;
                }
            });

            console.log(system);

            // Return the alarms as a JSON object
            res.setHeader('content-type', 'application/json');
            res.json(system);
        } catch (error) {
            console.log('Something has gone wrong parsing the system api');
            return render_error(res, error);
        }
    });
});

/* GET api json for S4 fan board 1 */
router.get('/monitor/fanboard1', function (req, res, next) {
    //TODO replace file reader with real http request
    // var request_options = {
    //     url: 'http://192.168.16.200/',
    //     proxy: ''
    // };

    // request.get(request_options, function (err, res, body) {
    //     if (!err && res.statusCode == 200) {
    //     }
    // })

    // Using file reader for testing purposes
    fs.readFile('Refuge Chamber.html', 'utf8', function (err, data) {
        if (err) {
            return render_error(res, err);
        }

        try {
            // Load the document into jQuery
            jq = cheerio.load(data);

            // Create an object to store the status
            var fanboard1 = {};
            var fanboard1_name = '';
            var fanboard1_info = '';

            var continue_past = true;

            // Itterate over each of the elements in the table so they can be added to status
            jq('table.status').find('td.left').each(function (index, element) {
                // Name is found by the bold subchild
                fanboard1_name = jq(element).find('b').text().toLowerCase();

                // Standardise some of the names that contain html tags and other characters
                fanboard1_name = fanboard1_name.replace(/<(?:.|\n)*?>/g, '').replace(/:/g, '').trim();

                // Skip past all the stuff before what we care about
                if (fanboard1_name == 'fan board 1') {
                    // Add to the api the state of the table (shown/hiden)
                    fanboard1_info = !jq(element).parent().hasClass('hide');
                    fanboard1['enabled'] = fanboard1_info;

                    continue_past = false;
                    return true;
                }
                else if (continue_past) {
                    return true;
                }

                // Info is found in the next column over
                // Use html() here also for reasons
                fanboard1_info = jq(element).next().html();
                if (fanboard1_info != null) {
                    // Only care about numbers, sign, and decimal point
                    fanboard1_info = fanboard1_info.match(/[-+0-9.]+/g)[0]
                }

                if (fanboard1_name == 'fan board 2') {
                    // Done with this section
                    return false;
                }
                else {
                    // Add the info to the object
                    fanboard1[fanboard1_name] = fanboard1_info;
                }
            });

            console.log(fanboard1);

        } catch (error) {
            console.log('Something has gone wrong parsing the fan board 1');
            return render_error(res, error);
        }

        // Return the alarms as a JSON object
        res.setHeader('content-type', 'application/json');
        res.json(fanboard1);

    });
});

/* GET api json for S4 fan board 2 */
router.get('/monitor/fanboard2', function (req, res, next) {
    //TODO replace file reader with real http request
    // var request_options = {
    //     url: 'http://192.168.16.200/',
    //     proxy: ''
    // };

    // request.get(request_options, function (err, res, body) {
    //     if (!err && res.statusCode == 200) {
    //     }
    // })

    // Using file reader for testing purposes
    fs.readFile('Refuge Chamber.html', 'utf8', function (err, data) {
        if (err) {
            return render_error(res, err);
        }

        try {
            // Load the document into jQuery
            jq = cheerio.load(data);

            // Create an object to store the status
            var fanboard2 = {};
            var fanboard2_name = '';
            var fanboard2_info = '';

            var continue_past = true;

            // Itterate over each of the elements in the table so they can be added to status
            jq('table.status').find('td.left').each(function (index, element) {
                // Name is found by the bold subchild
                fanboard2_name = jq(element).find('b').text().toLowerCase();

                // Standardise some of the names that contain html tags and other characters
                fanboard2_name = fanboard2_name.replace(/<(?:.|\n)*?>/g, '').replace(/:/g, '').trim();

                // Skip past all the stuff before what we care about
                if (fanboard2_name == 'fan board 2') {
                    // Add to the api the state of the table (shown/hiden)
                    fanboard2_info = !jq(element).parent().hasClass('hide');
                    fanboard2['enabled'] = fanboard2_info;

                    continue_past = false;
                    return true;
                }
                else if (continue_past) {
                    return true;
                }

                // Info is found in the next column over
                // Use html() here also for reasons
                fanboard2_info = jq(element).next().html();
                if (fanboard2_info != null) {
                    // Only care about numbers, sign, and decimal point
                    fanboard2_info = fanboard2_info.match(/[-+0-9.]+/g)[0]
                }

                if (fanboard2_name == 'current loops') {
                    // Done with this section
                    return false;
                }
                else {
                    // Add the info to the object
                    fanboard2[fanboard2_name] = fanboard2_info;
                }
            });

            console.log(fanboard2);

        } catch (error) {
            console.log('Something has gone wrong parsing the fan board 1');
            return render_error(res, error);
        }

        // Return the alarms as a JSON object
        res.setHeader('content-type', 'application/json');
        res.json(fanboard2);

    });
});

/* GET api json for S4 current loops */
router.get('/monitor/currentloops', function (req, res, next) {
    //TODO replace file reader with real http request
    // var request_options = {
    //     url: 'http://192.168.16.200/',
    //     proxy: ''
    // };

    // request.get(request_options, function (err, res, body) {
    //     if (!err && res.statusCode == 200) {
    //     }
    // })

    // Using file reader for testing purposes
    fs.readFile('Refuge Chamber.html', 'utf8', function (err, data) {
        if (err) {
            return render_error(res, err);
        }

        try {
            // Load the document into jQuery
            jq = cheerio.load(data);

            // Create an object to store the status
            var currentloops = {};
            var currentloops_name = '';
            var currentloops_info = '';

            var continue_past = true;

            // Itterate over each of the elements in the table so they can be added to status
            jq('table.status').find('td.left').each(function (index, element) {
                // Name is found by the bold subchild
                currentloops_name = jq(element).find('b').text().toLowerCase();

                // Standardise some of the names that contain html tags and other characters
                currentloops_name = currentloops_name.replace(/<(?:.|\n)*?>/g, '').replace(/:/g, '').trim();

                // Skip past all the stuff before what we care about
                if (currentloops_name == 'current loops') {
                    // Add to the api the state of the table (shown/hiden)
                    currentloops_info = !jq(element).parent().hasClass('hide');
                    currentloops['enabled'] = currentloops_info;

                    continue_past = false;
                    return true;
                }
                else if (continue_past) {
                    return true;
                }

                // Info is found in the next column over
                // Use html() here also for reasons
                currentloops_info = jq(element).next().html();
                if (currentloops_info != null) {
                    // Only care about numbers, sign, and decimal point
                    currentloops_info = currentloops_info.match(/[-+0-9.]+/g)[0]
                }

                // Add the info to the object
                currentloops[currentloops_name] = currentloops_info;
            });

            console.log(currentloops);

        } catch (error) {
            console.log('Something has gone wrong parsing the fan board 1');
            return render_error(res, error);
        }

        // Return the alarms as a JSON object
        res.setHeader('content-type', 'application/json');
        res.json(currentloops);

    });
});

/* GET api json for S4 alarms */
router.get('/monitor/alarms', function (req, res, next) {
    //TODO replace file reader with real http request
    // var request_options = {
    //     url: 'http://192.168.16.200/',
    //     proxy: ''
    // };

    // request.get(request_options, function (err, res, body) {
    //     if (!err && res.statusCode == 200) {
    //     }
    // })

    // Using file reader for testing purposes
    fs.readFile('Refuge Chamber.html', 'utf8', function (err, data) {
        if (err) {
            return render_error(res, err);
        }

        try {
            // Load the document into jQuery
            jq = cheerio.load(data);

            // Create an object to store the alarms
            var alarms = {};
            var error_name = '';
            var error_status = false;
            // Itterate over each of the alarms so they can be added
            jq('#alarms > p').each(function (index, element) {
                // Name is the label that shows for each error
                error_name = jq(element).text().toLowerCase().trim();
                // If the alarm isnt hidden this will resolve to true
                error_status = !jq(element).hasClass('hide');
                // Add the alarms to the object
                alarms[error_name] = error_status;
            });

            console.log(alarms);

        } catch (error) {
            console.log('Something has gone wrong parsing the alarms api');
            return render_error(res, error);
        }

        // Return the alarms as a JSON object
        res.setHeader('content-type', 'application/json');
        res.json(alarms);

    });
});



module.exports = router;
