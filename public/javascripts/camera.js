$(document).ready(function ($) {
  var internal_showing = $('#internal-1');
  // var internal_working = $('#internal-2');
  // var external_showing = $('#external-1');
  // var external_working = $('#external-2');
  update_internal_image();
  // update_external_image();
  setInterval(function () {
    update_internal_image();
    // update_external_image();
  }, 1000);

  function update_internal_image() {
    // var oldshowing = internal_showing;
    // internal_showing = internal_working;
    // internal_working = oldshowing;
    // internal_showing.css('visibility', 'visible');
    // internal_working.css('visibility', 'hidden');

    // internal_working.attr('src', '/api/camera/internal?' + Date.now());
    // $("#internal-2").css('margin-top', '-' + internal_showing.height() + 'px').css('display', 'block');

    internal_showing.attr('src', '/api/camera/internal?' + Date.now());
  }

  // function update_external_image() {
  //   var oldshowing = external_showing;
  //   external_showing = external_working;
  //   external_working = oldshowing;
  //   external_showing.css('visibility', 'visible');
  //   external_working.css('visibility', 'hidden');

  //   external_working.attr('src', '/api/camera/external?' + Date.now());
  //   $("#external-2").css('margin-top', '-' + external_showing.height() + 'px').css('display', 'block');
  // }
});