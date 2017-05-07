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
