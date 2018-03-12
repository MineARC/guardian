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
// 4 - battmon

console.log('cams: ' + cams_jumper);
console.log('aura: ' + aura_jumper);
console.log('extn: ' + extn_jumper);
console.log('mode: ' + mode_jumper);

exports.cams = cams_jumper;
exports.aura = aura_jumper;
exports.extn = extn_jumper;
exports.mode = mode_jumper;

exports.localize = fs.readFileSync('/boot/localize', 'utf8').trim();
exports.sitename = fs.readFileSync('/boot/sitename', 'utf8').trim();

if (fs.existsSync('/boot/battmon_style')) {
  if (fs.readFileSync('/boot/battmon_style', 'utf8').trim() == 'standalone')
    exports.mode = 4;
  exports.battmon_strings = fs.readFileSync('/boot/battmon_strings', 'utf8').trim();
}
