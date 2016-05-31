var nmap = require('libnmap')
var exec = require('child_process').exec;
var exports = module.exports;

// child = exec('ifconfig eth0 | grep "inet "')

// var opts = {
//   timeout: 1,
//   range: ['192.168.16.0/24'],
//   flags: ['-sP'],
//   ports: '80'
// };

// nmap.discover(function (err, report) {
//   if (err) throw new Error(err);

//   for (var item in report) {
//     console.log(JSON.stringify(report[item]));
//   }
// });