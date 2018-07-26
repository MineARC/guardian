var dataLength = 8630; // number of dataPoints visible at any point

$(document).ready(function($) {
  $('#alias').editable({
    type : 'text',
    mode : 'inline',
    showbuttons : false,
    url : function(params) {
      var d = new $.Deferred();
      $.post('/settings/setAlias', {alias : params.value}).then(function() { d.resolve(); });
      return d.promise();
    }
  });
});

// // Updates the active alarms from the api
// function updateAlarms(data) {
//   var html = '';
//   for (key in data) {
//     if (data[key].state)
//       html += '<p class="alert alert-danger">' + key;
//   }
//   $('#alarms').html(html);
// }

$.get('/api/monitor/history').then(function(data) {
  if (data.elv)
    updateELVHistory(data.elv);
  if (data.elvp)
    updateELVPHistory(data.elvp);
  if (data.series3)
    updateSeries3History(data.series3);
  if (data.series4)
    updateSeries4History(data.series4);
  if (data.aura)
    updateAuraHistory(data.aura);
  updatefromapi();
});

// Update charts, tables, and alarms after specified time.
setInterval(updatefromapi, 10000);

function updatefromapi() {
  $.get('/api/monitor/').then(function(data) {
    if (data.elv)
      updateELV(data.elv);
    if (data.elvp)
      updateELVP(data.elvp);
    if (data.series3)
      updateSeries3(data.series3);
    if (data.series4)
      updateSeries4(data.series4);
    if (data.cams)
      updateCams(data.cams);
    if (data.aura)
      updateAura(data.aura);
    if (data.battmon)
      updateBattmon(data.battmon);
    // updateAlarms(data.alarms);
  });
}