$(function () {
  $('#getUsers').on('click', function (e) {
    var parameters = {};
    $.get('/dbtest/getUsers', parameters, function (data) {
      $('#result').html(data);
    });
  });

  $('#addUser').on('click', function (e) {
    var parameters = {
      username: $("#username").val(),
      password: $("#password").val(),
      email: $("#email").val()
    };
    $.get('/dbtest/addUser', parameters, function (data) {
      $('#result').html(data);
    });
  });

  $('#removeUser').on('click', function (e) {
    var parameters = { username: $("#username").val() };
    $.get('/dbtest/removeUser', parameters, function (data) {
      $('#result').html(data);
    });
  });

  $('#getUsersEmail').on('click', function (e) {
    var parameters = { username: $("#username").val() };
    $.get('/dbtest/getUsersEmail', parameters, function (data) {
      $('#result').html(data);
    });
  });

  $('#updateUsersEmail').on('click', function (e) {
    var parameters = {
      username: $("#username").val(),
      email: $("#email").val()
    };
    $.get('/dbtest/updateUsersEmail', parameters, function (data) {
      $('#result').html(data);
    });
  });
  
  $('#compareUsersPassword').on('click', function (e) {
    var parameters = {
      username: $("#username").val(),
      password: $("#password").val()
    };
    $.post('/dbtest/compareUsersPassword', parameters, function (data) {
      $('#result').html(data);
    });
  });
  
  $('#updateUsersPassword').on('click', function (e) {
    var parameters = {
      username: $("#username").val(),
      password: $("#password").val()
    };
    $.get('/dbtest/updateUsersPassword', parameters, function (data) {
      $('#result').html(data);
    });
  });
});