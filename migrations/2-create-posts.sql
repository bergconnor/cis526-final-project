CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  subpage_id INTEGER,
  title TEXT,
  content TEXT,
  filename TEXT,
  fileType TEXT,
  FOREIGN KEY (subpage_id) REFERENCES subpages(id)
);
