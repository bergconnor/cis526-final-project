$('#login-form').on('submit', (event) => {
  event.preventDefault();
  var user = $("#login-form :input").serialize();
  $.post('/sessions/', user, function() {
    window.location.replace("/");
  }).fail(function() {
    alert('Unsuccessful login');
  });
});

$('#sign-up-form').on('submit', (event) => {
  event.preventDefault();
  var user = $("#sign-up-form :input").serialize();
  $.post('/users/', user, function() {
    window.location.replace("/");
  }).fail(function() {
    alert('Invalid username/email');
  });
});
