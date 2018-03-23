function updateBattmonHistory(data) {}

function updateBattmon(data) {
  for (var i = 0; i < data.Bank.length; i++) {
    $('.string-' + (i + 1) + ' .battery-temp .temperature')[0].childNodes[0].nodeValue = data.Bank[i].Temperature.value;

    $('.string-' + (i + 1) + ' .battery-1 .voltage')
    [0].childNodes[0].nodeValue = data.Bank[i].Battery[0].status == 1 ? 'Alarm High' : data.Bank[n].Battery[0].status == -1 ? 'Alarm Low' : 'Good';
    $('.string-' + (i + 1) + ' .battery-2 .voltage')
    [0].childNodes[0].nodeValue = data.Bank[i].Battery[1].status == 1 ? 'Alarm High' : data.Bank[n].Battery[0].status == -1 ? 'Alarm Low' : 'Good';
    $('.string-' + (i + 1) + ' .battery-3 .voltage')
    [0].childNodes[0].nodeValue = data.Bank[i].Battery[2].status == 1 ? 'Alarm High' : data.Bank[n].Battery[0].status == -1 ? 'Alarm Low' : 'Good';
    $('.string-' + (i + 1) + ' .battery-4 .voltage')
    [0].childNodes[0].nodeValue = data.Bank[i].Battery[3].status == 1 ? 'Alarm High' : data.Bank[n].Battery[0].status == -1 ? 'Alarm Low' : 'Good';
  }
}