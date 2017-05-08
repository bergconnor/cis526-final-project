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
     $('#subpage-list').empty();
     $.get('/subpages/', (subpages) => {
       subpages.forEach(function(subpage) {
         $('<li>').addClass("sp-nav-item")
           .append(
             $('<a>')
               .attr("href", "/")
               .attr("id", subpage.name)
               .text(subpage.name)
               .on('click', (e) => {
                 e.preventDefault();
                 $("a.active").removeClass("active");
                 $(e.target).addClass("active");
                 reddit.showSubpage(subpage.id);
              })
          ).appendTo('#subpage-list');
      });
    });
  }

  /** @function newSubpage
   * Displays a form to create a new subpage
   * in the page's content div
   */
  reddit.newSubpage = function() {
    // grab and clear the content element
    var content = $('#content').empty();

    // append a title
    $('<h1>').text('Create New Subpage').appendTo(content);

    // display the edit form
    var form = $('<form>').appendTo(content);
    $('<div>').addClass('form-group')
      .appendTo(form)
      .append($('<label>').text('Subpage Name:'))
      .append($('<input name="name" type="text" class="form-control">'))
    $('<div>').addClass('form-group')
      .append($('<label>').text('Subpage Description:'))
      .append($('<textarea name="description" class="form-control">'))
      .appendTo(form);
    $('<button>').text("Create Subpage")
      .addClass('btn btn-primary')
      .appendTo(form)
      .on('click', function(e){
        e.preventDefault();
        $.post('/subpages/', form.serialize(), function(subpage) {
          console.log(subpage.id);
          reddit.listSubpages();
          reddit.showSubpage(subpage.id);
        });
      });
  }

  /** @function showSubpage
   * Displays the specified subpage in the
   * content div of the page
   * @param {integer} id - the id of the subpage
   */
  reddit.showSubpage = function(id) {
    // grab and clear the content element
    var content = $('#content').empty();

    $.get('/subpages/' + id, function(subpage) {
      // change the active tabe
      $('a.active').removeClass("active");
      $('#' + subpage.name).addClass("active");

      $('<div>').addClass("subpage-header")
        .append($('<h1>')
          .text(subpage.name))
        .append($('<p>')
          .text(subpage.description))
        .append($('<button>')
          .addClass("btn btn-primary")
          .text('Add Post')
          .on('click', function(e) {
            reddit.newPost(id);
          }))
        .appendTo('#content');
    });
    reddit.listPostsByID(id);
  }
}
