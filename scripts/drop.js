// Set up the database
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('reddit.sqlite3', function(err) {
  if(err) console.error(err);
});

db.run("DROP TABLE IF EXISTS posts");
db.run("DROP TABLE IF EXISTS subpages");
db.run("DELETE FROM migrations WHERE filename='2-create-posts.sql'");
db.run("DELETE FROM migrations WHERE filename='1-create-subpages.sql'");
