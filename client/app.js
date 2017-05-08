/* Main entry point */

var reddit = {}

/* Add functionality to the library */
require('./user')(reddit);
require('./session')(reddit);
require('./subpage')(reddit);
require('./post')(reddit);

reddit.listSubpages();
reddit.listPosts();

/* Apply menu controls */
$('#home-link').on('click', function(e) {
  e.preventDefault();
  reddit.listPosts();
  $('a.active').removeClass("active");
  $(e.target).addClass("active");
});

$('#login-logout-link').on('click', function(e) {
  e.preventDefault();
  if(reddit.isLoggedIn()) {
    reddit.destroySession();
  } else {
    $('a.active').removeClass("active");
    $(e.target).addClass("active");
    reddit.newSession();
  }
});

$('#add-subpage-link').on('click', function(e) {
  e.preventDefault();
  $('a.active').removeClass("active");
  $(e.target).addClass("active");
  reddit.newSubpage();
});

$(document).ready(function() {
  if(reddit.isLoggedIn()) {
    $('#login-logout-link').text('Logout');
  } else {
    $('#login-logout-link').text('Login');
  }
});
