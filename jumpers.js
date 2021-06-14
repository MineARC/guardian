var rpio = require('rpio');
var fs = require('fs');

rpio.open(36, rpio.INPUT, rpio.PULL_DOWN);
rpio.open(32, rpio.INPUT, rpio.PULL_DOWN);
rpio.open(37, rpio.INPUT, rpio.PULL_DOWN);
rpio.open(40, rpio.INPUT, rpio.PULL_DOWN);
rpio.open(38, rpio.INPUT, rpio.PULL_DOWN);

var cams_jumper = rpio.read(36);
var aura_jumper = rpio.read(32);
var extn_jumper = rpio.read(37);
var mode_jumper = rpio.read(40) + 2 * rpio.read(38);

// 0 - elv
// 1 - elvp
// 2 - S3
// 3 - S4

console.log('cams: ' + cams_jumper);
console.log('aura: ' + aura_jumper);
console.log('extn: ' + extn_jumper);
console.log('mode: ' + mode_jumper);

fs.readFile('/boot/guardian/locale', 'utf8', function(err, contents) {
  exports.localize = !err ? contents.trim() : 'au';
});

fs.readFile('/boot/guardian/site', 'utf8', function(err, contents) {
  exports.sitename = !err ? contents.trim() : 'MineARC';
});

fs.stat('/boot/guardian/firefly', function(err, stats) {
  exports.firefly = !err;
});

fs.stat('/boot/guardian/disable_air_leak', function(err, stats) {
  exports.disable_air_leak = !err;
});

fs.stat('/boot/guardian/aura_extras', function(err, stats) {
  exports.aura_extras = !err;
});
exports.cams = cams_jumper;
exports.aura = aura_jumper;
exports.extn = extn_jumper;
exports.mode = mode_jumper;
