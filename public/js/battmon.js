function updateBattmonHistory(data) {

}

function updateBattmon(data) {
  for(var i = 0; i < data.strings; i++)
  {
    $('.string-' + i + 1 + ' .battery-1 .voltage')[0].childNodes[0].nodeValue = data.strings[i][i].voltage;
    $('.string-' + i + 1 + ' .battery-1 .temperature')[0].childNodes[0].nodeValue = data.strings[i][i].temperature;

    $('.string-' + i + 1 + ' .battery-2 .voltage')[0].childNodes[0].nodeValue = data.strings[i][i].voltage;
    $('.string-' + i + 1 + ' .battery-2 .temperature')[0].childNodes[0].nodeValue = data.strings[i][i].temperature;

    $('.string-' + i + 1 + ' .battery-3 .voltage')[0].childNodes[0].nodeValue = data.strings[i][i].voltage;
    $('.string-' + i + 1 + ' .battery-3 .temperature')[0].childNodes[0].nodeValue = data.strings[i][i].temperature;

    $('.string-' + i + 1 + ' .battery-4 .voltage')[0].childNodes[0].nodeValue = data.strings[i][i].voltage;
    $('.string-' + i + 1 + ' .battery-4 .temperature')[0].childNodes[0].nodeValue = data.strings[i][i].temperature;
  }
}