function updateBattmonHistory(data) {}

function updateBattmon(data) {
  for (var i = 0; i < data.Bank.length; i++) {
    for (var j = 0; j < 4; j++) {
      $('.string-' + (i + 1) + ' .battery-' + (j + 1) + ' .voltage')[0].childNodes[0].nodeValue = data.Bank[n][1].Voltage + ' V';
      $('.string-' + (i + 1) + ' .battery-' + (j + 1) + ' .temperature')[0].childNodes[0].nodeValue = data.Bank[n][1].Temperature + ' C';
    }
  }
} 