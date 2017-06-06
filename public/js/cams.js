function updateCams(data) {
  var html = '<h3>CAMS</h3><table class="table"><tr><td>Occupied</td><td class="table-right">' + (data.occupied ? 'Yes' : 'No') + '</tr><tr><td>Airflow</td><td class="table-right">' + (data.solenoid ? 'No' : 'Yes') + '</td></tr><tr><td>Airflow Uptime</td><td class="table-right">' + (data.rate * 100).toFixed(2) + ' %</td></tr></table>';
  $('#cams').html(html);
}