$(document).ready(function ($) {
  var internal_showing = $('#internal');
  var timeout;
  var timestamp = Date.now();
  $('#internal').bind('load', update_internal_image);

  update_internal_image();

  function update_internal_image() {
    if (timestamp + 1000 <= Date.now()) {
      internal_showing.attr('src', '/api/camera/internal?' + Math.floor(Date.now() / 1000));
      clearTimeout(timeout);
      timeout = setTimeout(update_internal_image, 20000);
      timestamp = Date.now();
    }
    else {
      setTimeout(update_internal_image, Date.now - timestamp + 1000);
    }
  }
});