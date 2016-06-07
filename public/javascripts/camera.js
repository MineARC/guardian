$(document).ready(function ($) {
  var updating_image = true;
  update_image(function () {
    updating_image = false;
  });
  setInterval(function () {
    if (!updating_image) {
      updating_image = true;
      update_image(function () {
        updating_image = false;
      });
    }
  }, 1000);

  function update_image(next) {
    $('#camera-internal').find('img').attr('src', '/api/camera/internal?' + Date.now());
    $('#camera-external').find('img').attr('src', '/api/camera/external?' + Date.now());
    next();
  }
});