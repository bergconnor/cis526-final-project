"use strict";

/** @module media
 * A module of functions for media files
 */
module.exports = {
  getExtension: getExtension,
  isImage: isImage,
  isVideo: isVideo,
  createFilename: createFilename,
  addImageRoute: addImageRoute,
  addVideoRoute: addVideoRoute,
  addOtherRoute, addOtherRoute
}

// requires
var fs = require('fs');
var crypto = require('crypto');

/** @function getExtension
 * Determines the files extensions based on the
 * characters following the last period.
 *
 * @param {string} filename - the name of the file
 * @returns {string} the file extension
 */
function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

/** @function isImage
 * Use the files extension to determine if the
 * file is an image.
 * @param {string} filename - the name of the file
 */
function isImage(filename) {
  var ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'gif':
    case 'bmp':
    case 'png':
    return true;
  }
  return false;
}

/** @function isVideo
 * Use the files extension to determine if the
 * file is a video.
 * @param {string} filename - the name of the file
 */
function isVideo(filename) {
  var ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case 'm4v':
    case 'avi':
    case 'mpg':
    case 'mp4':
      return true;
  }
  return false;
}

/** @function createFilename
 * Creates a new filename by taking the current
 * date in the format 'YYYYMMDD' and appending
 * the original filename and current milliseconds
 * hased together with md5.
 * @param {string} filename - the name of the file
 * @returns {string} the new filename
 */
function createFilename(filename) {
  // create a new date object
  var date = new Date();
  var year = date.getFullYear().toString();
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);

  // combine the old filename and current milliseconds and hash with md5
  var hash = crypto.createHash('md5').update(filename + date.getMilliseconds()).digest('hex');

  return year + month + day + '_' + hash;
}

/** @function addImageRoute
 */
function addImageRoute(filename, path, db) {
  var router = new (require('./route')).Router(db);

  router.get(newpath, function(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/octet-stream');
    res.end(newpath);
  });
}

/** @function addVideoRoute
 */
function addVideoRoute(filename, path, db) {
  var router = new (require('./route')).Router(db);

  router.get(newpath, function(req, res) {
    // The range header specifies the part of the file to send
    // in the form bytes={start}-{end}, where {start} is
    // the starting byte position in the file to stream, and
    // {end} is the ending byte position (or blank)
    var range = req.headers.range;
    // if(!range) range = 'bytes=0-';
    var positions = range.replace(/bytes=/, "").split("-");
    var start = parseInt(positions[0], 10);
    // Extract the video file name from the url, and
    // use the extension to set up the file type
    var path = 'uploads/videos/' + filename;
    var type = 'video/' + getExtension(filename);
    // We need to stat the video file to determine the
    // correct ending byte index (as the client may be
    // requesting more bytes than our file contains)
    fs.stat(path, (err, stats) => {
      if(err) {
        console.error(err);
        res.statusCode = 404;
        res.end();
        return;
      }
      var total = stats.size;
      // Set the end position to the specified end, or the total
      // number of bytes - 1, whichever is smaller.
      var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      // The chunk size is the number of bytes we are sending,
      // i.e. the end-start plus one.
      var chunksize = (end - start) + 1;
      // Set the response status code to 206: partial content,
      // and set the headers to specify the part of the video
      // we are sending
      res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": type
      });
      // Pipe the portion of the file we want to send to the
      // response object.
      var stream = fs.createReadStream(path, {start: start, end: end})
        .on('open', () => stream.pipe(res))
        .on('error', (err) => res.end(err));
    });
  });
}

/** @function addOtherRoute
 */
function addOtherRoute(filename, path, db) {
  var router = new (require('./route')).Router(db);

  // TO DO: add routes for other file types
}
