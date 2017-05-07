/* Main entry point */

var reddit = {}

/* Add functionality to the library */
require('./subpage')(reddit);

reddit.listSubpages();

/* Apply menu controls */
$('#login-logout-link').on('click', (event) => {
  event.preventDefault();
  if(isLoggedIn()) {
    $.get('/sessions/encryptedSession/destroy', function() {
      window.location.replace("/");
    }).fail(function() {
      alert('Failed to logout');
    });
  } else {
    window.location.replace('/login.html');
  }
});

$('#subpage-form').on('submit', (event) => {
  event.preventDefault();
  var subpage = $("#subpage-form :input").serialize();
  $.post('/subpages/', subpage, function() {
    window.location.replace('/');
  }).fail(function() {
    alert('This subpage already exists');
  });
});

$(document).ready(function() {
  if(isLoggedIn()) {
    $('#login-logout-link').text('Logout');
  } else {
    $('#login-logout-link').text('Login');
  }
});


/**
 * @function isLoggedIn
 * Determines if a user is logged in based
 * on the session cookie.
 * @returns {boolean} Whether or not a user
 * is logged in.
 */
function isLoggedIn() {
  // get the session cookie
  var value = "; " + document.cookie;
  var parts = value.split("; encryptedSession=");
  var cryptedCookie = "";
  // get the value of the session cookie
  if(parts.length == 2) {
    cryptedCookie = parts.pop().split(";").shift();
  }

  // if the cookie value is not an empty string
  // a user is logged in
  return (cryptedCookie.length > 0);
}
