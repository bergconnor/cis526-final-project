// Set up the database
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('reddit.sqlite3', function(err) {
  if(err) console.error(err);
});

db.run("DROP TABLE IF EXISTS migrations");
db.run("DROP TABLE IF EXISTS users");

// Run the migrations
var migrate = require('../lib/migrate');
migrate(db, 'migrations', function(err){
  if(err) console.error(err);
  else console.log("Migrations complete!");
});
