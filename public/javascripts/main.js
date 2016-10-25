$(document).ready(function ($) {
  $('#alias').editable({
    type: 'text',
    mode: 'inline',
    showbuttons: false,
    url: function (params) {
      var d = new $.Deferred();
      $.post('/settings/setAlias', { alias: params.value }).then(function () {
        d.resolve();
      });
      return d.promise();
    }
  });
});