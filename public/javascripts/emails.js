$(document).ready(function ($) {
  $('.check_all').click(function () {
    // Check all checkboxes when check_all is clicked
    $(this).closest('ul.dropdown-menu').find('input:checkbox').prop('checked', true);

    // Update the number of subscriptions
    var length = $(this).closest('ul.dropdown-menu').find('input:checkbox:checked').length;
    $(this).closest('div.dropdown').find('.num_subs').text(length);
  });
  $('.uncheck_all').click(function () {
    // Uncheck all checkboxes when check_all is clicked
    $(this).closest('ul.dropdown-menu').find('input:checkbox').prop('checked', false);

    // Update the number of subscriptions
    var length = $(this).closest('ul.dropdown-menu').find('input:checkbox:checked').length;
    $(this).closest('div.dropdown').find('.num_subs').text(length);
  });
  $('input:checkbox').change(function () {
    // Update the number of subscriptions
    var length = $(this).closest('ul.dropdown-menu').find('input:checkbox:checked').length;
    $(this).closest('div.dropdown').find('.num_subs').text(length);
  });
  $(document).on('click', '.dropdown-menu', function (event) {
    // Dont close the dropdown when you are clicking on elements inside it
    event.stopPropagation();
  });
  $('#confirm-delete').on('click', '.btn-ok', function (event) {
    var $modalDiv = $(event.delegateTarget);
    var email = $(this).data('email');

    $modalDiv.addClass('loading');
    $.post('/emails/delEmail', { email: email }).then(function () {
      $modalDiv.modal('hide').removeClass('loading');
      location.reload();
    });
  });
  $('#confirm-delete').on('show.bs.modal', function (event) {
    var data = $(event.relatedTarget).data();
    $('.title', this).text(data.email);
    $('.btn-ok', this).data('email', data.email);
  });

  $('#btn-add').click(function (event) {
    console.log($(this).closest('div.input-group').find('input').val());
    var email = $(this).closest('div.input-group').find('input').val();
    $.post('/emails/addEmail', { email: email }).then(function (res) {
      if (res == 'User added') {
        location.reload();
      }
      else {
        $('#error-alert').show();
        window.setTimeout(function () {
          $('#error-alert').hide();
        }, 3000);
      }
    });
  });
});