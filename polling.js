var request = require('request');
var fs = require('fs');

// Define object for access from where they are needed
var monitor_data = '';
exports.monitor_data = monitor_data;

// Spin up polling of backend services
var monitor_is_polling = false;
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
    console.log('running monitor polling');

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
        monitor_data = data;
        // Call the callback funtion to manage passing of the data
        // and to restart the polling
        next();
    });
}