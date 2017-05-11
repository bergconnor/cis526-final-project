/* Main entry point */

var reddit = {}

/* Add functionality to the library */
require('./user')(reddit);
require('./session')(reddit);
require('./subpage')(reddit);
require('./post')(reddit);
require('./comment')(reddit);

reddit.listSubpages();
reddit.listPosts();
reddit.listComments();

/* Apply menu controls */
$(document).ready(function() {
  $('#home-icon').append(reddit.octicons.home.toSVG({"width": 24}));
  $('#add-subpage-icon').append(reddit.octicons.plus.toSVG({"width": 24}));

  if(reddit.isLoggedIn()) {
    $('#login-logout-icon').empty();
    $('#login-logout-icon').append(reddit.octicons['sign-out'].toSVG({"width": 24}));
  } else {
    $('#login-logout-icon').empty();
    $('#login-logout-icon').append(reddit.octicons['sign-in'].toSVG({"width": 24}));
  }

  var post_link = $('#post-link')
  if(post_link) {
    post_link.remove();
  }

  var comment_link = $('#comment-link')
  if(comment_link) {
    comment_link.remove();
  }
});

$('#home-link').on('click', function(e) {
  e.preventDefault();

  var post_link = $('#post-link')
  if(post_link) {
    post_link.remove();
  }

  var comment_link = $('#comment-link')
  if(comment_link) {
  comment_link.remove();
  }

  reddit.listPosts();
  $('a.active').removeClass("active");
  $(e.target).addClass("active");

});

$('#login-logout-link').on('click', function(e) {
  e.preventDefault();
  if(reddit.isLoggedIn()) {
    // $('#login-logout-icon').empty();
    // $('#login-logout-icon').append(reddit.octicons['sign-in'].toSVG({"width": 24}));
    reddit.destroySession();
  } else {
    // $('#login-logout-icon').empty();
    // $('#login-logout-icon').append(reddit.octicons['sign-out'].toSVG({"width": 24}));
    reddit.newSession();
  }
});

$('#add-subpage-link').on('click', function(e) {
  e.preventDefault();
  $('a.active').removeClass("active");
  $(e.target).addClass("active");
  reddit.newSubpage();
});
