function updateBattmonHistory(data) {}

function updateBattmon(data) {
  for (var i = 0; i < data.Bank.length; i++) {
    $('.string-' + (i + 1) + ' .battery-temp .temperature')[0].childNodes[0].nodeValue = data.Bank[i].Temperature.value;

    for (var j = 0; j < 4; j++) {
      $('.string-' + (i + 1) + ' .battery-' + (j + 1)).removeClass('batt-allow');
      $('.string-' + (i + 1) + ' .battery-' + (j + 1)).removeClass('batt-alhigh');

      $('.string-' + (i + 1) + ' .battery-' + (j + 1))
          .addClass(data.Bank[i].Battery[j].status == 1 ? 'batt-alhigh' : data.Bank[i].Battery[j].status == -1 ? 'batt-allow' : '')

      $('.string-' + (i + 1) + ' .battery-' + (j + 1) + ' .voltage')
      [0].childNodes[0].nodeValue = data.Bank[i].Battery[j].status == 1 ? '⇡ High' : data.Bank[i].Battery[j].status == -1 ? '⇣ Low' : '✔ Good';
    }
  }
}