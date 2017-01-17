$(document).ready(function ($) {

  // $.getScript('https://unpkg.com/isotope-layout@3.0/dist/isotope.pkgd.min.js', function () {
  //   $('#container').isotope({
  //     itemSelector: '.items',
  //     layoutMode: 'fitRows'
  //   });
  // });


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