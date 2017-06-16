function updateCams(data) {
  $('#table-cams tr:contains("Occupied") .row-info').text(data.occupied ? 'Yes' : 'No');
  $('#table-cams tr:contains("Airflow") .row-info').text(data.solenoid ? 'No' : 'Yes');
  $('#table-cams tr:contains("Uptime") .row-info').text((data.rate * 100).toFixed(2) + ' %');
}