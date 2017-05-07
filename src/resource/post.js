"use strict";

/** @module post
 * A RESTful resource representing a post
 * implementing the CRUD methods.
 */

module.exports = {
  list: list,
  create: create,
  read: read,
  update: update,
  destroy: destroy,
  listBySubpage: listBySubpage
}

var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var media = require('./../../lib/media');

/** @function list
 * Sends a list of all posts as a JSON array.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function list(req, res, db) {
    db.all("SELECT * FROM posts", [], function(err, posts) {
      if(err) {
        console.error(err);
        res.statusCode = 500;
        res.end("Server Error")
      }
      res.setHeader("Content-Type", "text/json");
      res.end(JSON.stringify(posts));
    });
}

/** @function create
 * Creates a new post and adds it to the database.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function create(req, res, db) {
  // create an incoming form object
  var form = new formidable.IncomingForm();

  // parse the incoming request containing the form data
  form.parse(req, function (err, fields, files) {
    // get the original filename and path
    var oldFilename = files.media.name;
    var oldPath = files.media.path;

    // set the destination folder and file type
    var folder = 'other/';
    var type = 'other';
    if(media.isImage(oldFilename)) {
      folder = 'images/';
      type = 'image';
    } else if(media.isVideo(oldFilename)) {
      folder = 'videos/';
      type = 'video';
    }

    // rename and store the file
    var newFilename = media.createFilename(oldFilename);
    var newPath = __dirname + '/../../uploads/' + folder + newFilename;
    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err;
    });

    db.run('INSERT INTO posts (subpage_id, title, content, filename, fileType) VALUES (?, ?, ?, ?, ?)', [
        fields.subpage_id,
        fields.title,
        fields.content,
        newFilename,
        type
      ], function(err) {
        if(err) {
          console.error(err);
          res.statusCode = 500;
          res.end("Server error");
          return;
        }
      }
    );

    // define the appropriate route to the file
    if(media.isImage(oldFileName)) {
      media.addImageRoute(newFilename, newPath, db);
    } else if(media.isVideo(oldFileName)) {
      media.addVideoRoute(newFilename, newPath, db);
    } else {
      media.addMediaRoute(newFilename, newPath, db);
    }
  });
}

/** @function read
 * Serves a specific post as a JSON string
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function read(req, res, db) {
  var id = req.params.id;
  db.get("SELECT * FROM posts WHERE id=?", [id], function(err, post) {
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server error");
      return;
    }
    if(!post) {
      res.statusCode = 404;
      res.end("Post not found");
      return;
    }
    res.setHeader("Content-Type", "text/json");
    res.end(JSON.stringify(post));
  });
}

/** @update
 * Updates a specific post with the supplied values
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function update(req, res, db) {
  var id = req.params.id;
  db.get('SELECT name, description FROM posts where id=?', [id], function(post) {
    res.setHeader("Content-Type", "text/json");
    res.end(JSON.stringify(post));
  });
}

/** @destroy
 * Removes the specified post from the database.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function destroy(req, res, db) {
  var id = req.params.id;
  db.run("DELETE FROM posts WHERE id=?", [id], function(err) {
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server error");
    }
    res.statusCode = 200;
    res.end();
  });
}

/** @function listBySubpage
 * Sends a list of all posts with the given subpage_id as a JSON array.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function listBySubpage(req, res, db) {
    var subpage_id = req.params.id;
    db.all("SELECT * FROM posts WHERE subpage_id=?", [subpage_id], function(err, posts) {
      if(err) {
        console.error(err);
        res.statusCode = 500;
        res.end("Server Error")
      }
      res.setHeader("Content-Type", "text/json");
      res.end(JSON.stringify(posts));
    });
}
