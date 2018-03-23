var request = require('request');
var cheerio = require('cheerio');
var jq = require('jquery');
var jumpers = require('./jumpers');

console.log("battmon_polling loaded");

var moving_median = {Bank : []};

var test_data = {Bank : []};

var battmon_data = {
  Bank : [],
  Balance :
      {MODE : false, EN1 : false, EN2 : false, TERM1 : false, TERM2 : false, BAL : false, DONE : false, BATX : false, BATY : false, UVFLT : false, OVFLT : false, PTCFLT : false}
};

for (var i = 0; i < jumpers.battmon_strings; i++) {
  battmon_data.Bank[i] = {Temperature : {value : 12, unit : 'C'}, Battery : [ {status : 'Good'}, {status : 'Good'}, {status : 'Good'}, {status : 'Good'} ]};

  test_data.Bank[i] = [ {Temperature : 12, Voltage : 12}, {Temperature : 12, Voltage : 12}, {Temperature : 12, Voltage : 12}, {Temperature : 12, Voltage : 12} ];

  moving_median.Bank[i] = [
    {Voltage : [ '-', '-', '-', '-', '-', '-', '-', '-', '-', '-' ], Temperature : [ '-', '-', '-', '-', '-', '-', '-', '-', '-', '-' ]},
    {Voltage : [ '-', '-', '-', '-', '-', '-', '-', '-', '-', '-' ], Temperature : [ '-', '-', '-', '-', '-', '-', '-', '-', '-', '-' ]},
    {Voltage : [ '-', '-', '-', '-', '-', '-', '-', '-', '-', '-' ], Temperature : [ '-', '-', '-', '-', '-', '-', '-', '-', '-', '-' ]},
    {Voltage : [ '-', '-', '-', '-', '-', '-', '-', '-', '-', '-' ], Temperature : [ '-', '-', '-', '-', '-', '-', '-', '-', '-', '-' ]}
  ];
}

var battmon_alarms = {
  'Voltage High' : {state : false, type : 'battmon'},
  'Voltage Low' : {state : false, type : 'battmon'},
  'Temperature High' : {state : false, type : 'battmon'},
  'Temperature Low' : {state : false, type : 'battmon'},
  'Balance Undervoltage' : {state : false, type : 'battmon'},
  'Balance Overvoltage' : {state : false, type : 'battmon'},
  'Balance Overcurrent' : {state : false, type : 'battmon'}
};

exports.data = battmon_data;
exports.medians = test_data;
exports.alarms = battmon_alarms;

setInterval(poll_monitor, 9000);
poll_monitor();

function poll_monitor() {
  battmon_data.Bank.forEach(function(element, index) {
    var request_options = {url : 'http://172.17.0.' + (129 + index), proxy : ''};

    request.get(request_options, function(err, res, body) {
      if (!err && (res.statusCode == 200 || res.statusCode == 304)) {
        processPage(body);
      }
    });
  });

  updateAlarms();
}

function processPage(data) {
  jq = cheerio.load(data);

  if (jq('p').first().text() == 'version = 1.0') {
    var ltc3305 = parseInt(jq('p').first().next().text().split(" = ")[1]);
    battmon_data.Balance.MODE = (ltc3305 & 0x0001) != 0;
    battmon_data.Balance.EN1 = (ltc3305 & 0x0002) != 0;
    battmon_data.Balance.EN2 = (ltc3305 & 0x0004) != 0;
    battmon_data.Balance.TERM1 = (ltc3305 & 0x0008) != 0;
    battmon_data.Balance.TERM2 = (ltc3305 & 0x0010) != 0;
    battmon_data.Balance.BAL = (ltc3305 & 0x0020) == 0;
    battmon_data.Balance.DONE = (ltc3305 & 0x0040) == 0;
    battmon_data.Balance.BATX = (ltc3305 & 0x0080) != 0;
    battmon_data.Balance.BATY = (ltc3305 & 0x0100) != 0;
    battmon_data.Balance.UVFLT = (ltc3305 & 0x0200) == 0;
    battmon_data.Balance.OVFLT = (ltc3305 & 0x0400) == 0;
    battmon_data.Balance.PTCFLT = (ltc3305 & 0x0800) == 0;

    jq('tr').each(function(index, element) {
      var td = jq(element).find('td').first();
      if (td.length) {
        var string_no = parseInt(td.html()) - 1;
        td = td.next();
        var battery_no = parseInt(td.html());
        td = td.next();
        var voltage = parseFloat(td.html());
        td = td.next();
        var temperature = parseFloat(td.html());

        var real_voltage;

        switch (battery_no) {
        case 0:
          real_voltage = voltage * 1.054;
          break;
        case 1:
          real_voltage = voltage * 1.054;
          real_voltage -= moving_median.Bank[string_no][0].Voltage[moving_median.Bank[string_no][0].Voltage.length - 1];
          break;
        case 2:
          real_voltage = voltage * 1.054;
          real_voltage -= moving_median.Bank[string_no][1].Voltage[moving_median.Bank[string_no][1].Voltage.length - 1];
          real_voltage -= moving_median.Bank[string_no][0].Voltage[moving_median.Bank[string_no][0].Voltage.length - 1];
          break;
        case 3:
          real_voltage = voltage * 1.054;
          real_voltage -= moving_median.Bank[string_no][2].Voltage[moving_median.Bank[string_no][2].Voltage.length - 1];
          real_voltage -= moving_median.Bank[string_no][1].Voltage[moving_median.Bank[string_no][1].Voltage.length - 1];
          real_voltage -= moving_median.Bank[string_no][0].Voltage[moving_median.Bank[string_no][0].Voltage.length - 1];
          break;
        }

        moving_median.Bank[string_no][battery_no].Voltage.push(real_voltage);
        moving_median.Bank[string_no][battery_no].Voltage.shift();

        moving_median.Bank[string_no][battery_no].Temperature.push(temperature);
        moving_median.Bank[string_no][battery_no].Temperature.shift();

        if (battery_no == 3) {
          var median_of_medians_temperature = getMedian([
            getMedian(moving_median.Bank[string_no][0].Temperature), getMedian(moving_median.Bank[string_no][1].Temperature),
            getMedian(moving_median.Bank[string_no][2].Temperature), getMedian(moving_median.Bank[string_no][3].Temperature)
          ]);

          battmon_data.Bank[string_no].Temperature.value = median_of_medians_temperature.toFixed(1);

          var median_of_medians_voltage = getMedian([
            getMedian(moving_median.Bank[string_no][0].Voltage), getMedian(moving_median.Bank[string_no][1].Voltage), getMedian(moving_median.Bank[string_no][2].Voltage),
            getMedian(moving_median.Bank[string_no][3].Voltage)
          ]);

          for (var i = 0; i < 4; i++) {
            if (getMedian(moving_median.Bank[string_no][i].Voltage) - 1.3 > median_of_medians_voltage)
              battmon_data.Bank[string_no].Battery[i].status = 'Alarm High';
            else if (getMedian(moving_median.Bank[string_no][i].Voltage) > 15.2)
              battmon_data.Bank[string_no].Battery[i].status = 'Alarm High';
            else if (getMedian(moving_median.Bank[string_no][i].Voltage) + 1.3 < median_of_medians_voltage)
              battmon_data.Bank[string_no].Battery[i].status = 'Alarm Low';
            else if (getMedian(moving_median.Bank[string_no][i].Voltage) < 11.0)
              battmon_data.Bank[string_no].Battery[i].status = 'Alarm Low';
            else
              battmon_data.Bank[string_no].Battery[i].status = 'Good';

            test_data.Bank[string_no][i].Voltage = getMedian(moving_median.Bank[string_no][i].Voltage).toFixed(1);
            test_data.Bank[string_no][i].Temperature = getMedian(moving_median.Bank[string_no][i].Temperature).toFixed(1);
          }
        }

        exports.data = battmon_data;
        exports.medians = test_data;
      }
    });
  }
}

function updateAlarms() {
  var isVoltHigh = false;
  var isVoltLow = false;
  var isTempHigh = false;
  var isTempLow = false;

  for (var i = 0; i < jumpers.battmon_strings; i++) {
    for (var j = 0; j < 3; j++) {
      if (battmon_data.Bank[i].Battery[j].status == 'Alarm High')
        isVoltHigh = true;
      else if (battmon_data.Bank[i].Battery[j].status == 'Alarm Low')
        isVoltLow = true;

      if (getMedian(moving_median.Bank[i][j].Temperature) - 20 > battmon_data.Bank[i].Temperature.value)
        isTempHigh = true;
      else if (getMedian(moving_median.Bank[i][j].Temperature) + 20 < battmon_data.Bank[i].Temperature.value)
        isTempLow = true;
    }
  }

  battmon_alarms['Voltage High'].state = isVoltHigh;
  battmon_alarms['Voltage Low'].state = isVoltLow;
  battmon_alarms['Temperature High'].state = isTempHigh;
  battmon_alarms['Temperature Low'].state = isTempLow;
  battmon_alarms['Balance Undervoltage'].state = battmon_data.Balance.UVFLT;
  battmon_alarms['Balance Overvoltage'].state = battmon_data.Balance.OVFLT;
  battmon_alarms['Balance Overcurrent'].state = battmon_data.Balance.PTCFLT;
}

function getMedian(args) {
  if (!args.length) {
    return 0
  };
  var numbers = args.slice(0).sort((a, b) => a - b);
  var middle = Math.floor(numbers.length / 2);
  var isEven = numbers.length % 2 === 0;
  return isEven ? (numbers[middle] + numbers[middle - 1]) / 2 : numbers[middle];
}