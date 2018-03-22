function updateBattmonHistory(data) {

}

function updateBattmon(data) {
  for(var i = 0; i < data.Bank.length; i++)
  {
    $('.string-' + (i + 1) + ' .battery-1 .voltage')[0].childNodes[0].nodeValue = data.Bank[i][0].Voltage.value;
    $('.string-' + (i + 1) + ' .battery-1 .temperature')[0].childNodes[0].nodeValue = data.Bank[i][0].Temperature.value;

    $('.string-' + (i + 1) + ' .battery-2 .voltage')[0].childNodes[0].nodeValue = data.Bank[i][1].Voltage.value;
    $('.string-' + (i + 1) + ' .battery-2 .temperature')[0].childNodes[0].nodeValue = data.Bank[i][1].Temperature.value;

    $('.string-' + (i + 1) + ' .battery-3 .voltage')[0].childNodes[0].nodeValue = data.Bank[i][2].Voltage.value;
    $('.string-' + (i + 1) + ' .battery-3 .temperature')[0].childNodes[0].nodeValue = data.Bank[i][2].Temperature.value;

    $('.string-' + (i + 1) + ' .battery-4 .voltage')[0].childNodes[0].nodeValue = data.Bank[i][3].Voltage.value;
    $('.string-' + (i + 1) + ' .battery-4 .temperature')[0].childNodes[0].nodeValue = data.Bank[i][3].Temperature.value;
  }
}