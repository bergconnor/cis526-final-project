"use strict";

/** @module fileserver
 * A module for loading and serving static files
 */
module.exports = {
  loadDir: loadDir,
  isCached: isCached,
  serveFile: serveFile
}

// initialize the list of cached items
var files = {};

// requires
var fs = require('fs');

/**
 * @function loadDir
 * Recursively traverses the given directory and
 * caches any files found.
 * @param {string} directory the directory containing
 * the files to cache
 */
function loadDir(directory) {
  var items = fs.readdirSync(directory);
  items.forEach(function(item) {
    var path = directory + '/' + item;

    var stats = fs.statSync(path);
    if(stats.isFile()) {
      var parts = path.split('.');
      var extension = parts[parts.length-1];
      var type = 'application/octet-stream';
      switch(extension) {
        case 'html':
        case 'htm':
          type = 'text/html';
          break;
        case 'css':
          type = 'text/css';
          break;
        case 'js':
          type = 'text/javascript';
          break;
        case 'jpeg':
        case 'jpg':
          type = 'image/jpeg';
          break;
        case 'gif':
        case 'png':
        case 'bmp':
        case 'tiff':
        case 'svg':
          type = 'image/' + extension;
          break;
      }
      files[item] = {
        contentType: type,
        data: fs.readFileSync(path)
      };
      files['/' + item] = {
        contentType: type,
        data: fs.readFileSync(path)
      };
    }
    if(stats.isDirectory()) {
      loadDir(path);
    }
  });
}

/**
 * @function isCached
 * Determines given file is cached.
 * @param {string} path the path to the file
 * @returns {boolean} Whether or not the file
 * is cached.
 */
function isCached(path) {
  return files[path] != undefined;
}

/**
 * @function serveFile
 * Serves the given file.
 * @param {string} path the path to the file
 * @param {http.incomingRequest} req the request object
 * @param {http.serverResponse} res the repsonse object
 * @returns {boolean} Whether or not the file
 * is cached.
 */
function serveFile(path, req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', files[path].contentType);
  res.end(files[path].data);
}
