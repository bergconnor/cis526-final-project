(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./subpage":2}],2:[function(require,module,exports){
"use strict";

/** @module subpage
  * Adds functions for displaying subpages
  * to the supplied library object
  * @param {object} reddit - the object to expand
  */
module.exports = function(reddit) {

  /** @function listSubpages
   * Displays a list of subpages available
   * to the user in the content element
   */
  reddit.listSubpages = function() {
    $.get('/subpages/', (subpages) => {
      subpages.forEach(function(subpage) {
        $('<li>').addClass("subpage-nav-item")
          .append(
            $('<a>')
              .attr("href", "/")
              .text(subpage.name)
              .on('click', (event) => {
                event.preventDefault();
                $("a.active").removeClass("active");
                $(event.target).addClass("active");
                $('#subpage-content').empty();
                $('<h1>').text(subpage.name).appendTo('#subpage-content');
                $('<p>').text(subpage.description).appendTo('#subpage-content');
                reddit.showSubpage(subpage.id);
              })
          ).appendTo('#subpage-list');
      });
    });
  }

  /** @function showSubpage
   * Displays the specified subpage in the
   * content div of the page
   * @param {integer} id - the id of the subpage
   */
  reddit.showSubpage = function(id) {
    $.get('/posts/' + subpage.id + '/subpage', (posts) => {
      posts.forEach(function(post) {
        if(post.fileType === 'image') {
          $('<img>').attr('src', post.filename).appendTo('#subpage-content');
        } else if(post.fileType === 'video') {
          $('<video>').attr('controls', true).attr('src', post.filename).appendTo('#subpage-content');
        }
      });
    });
  }

  function temp() {
    $('#subpage-form').load('post-form.html').on('submit', (event) => {
      event.preventDefault();

      var post = new FormData($('form')[0]);
      post.append('subpage_id', subpage.id);

      $.post({
        url: '/posts/',
        data: post,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function() {
          window.location.replace('/home.html');
        }
      });
    });
  }
}

},{}]},{},[1]);
