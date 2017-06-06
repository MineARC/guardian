function updateAura(data) {
  var html = '<h3>Aura-FX</h3><table class="table"><tr><th>Name</th><th class="table-right">Value</th></tr>';
  for (var key in data) {
    if (data[key].isRecent) {
      html += '<tr><td>' + key + '</td>';
      html += '<td class="table-right">' + data[key].value + ' ' + data[key].unit + '</td></tr>';
    }
  }
  html += '</table>';
  $('#aura').html(html);
}