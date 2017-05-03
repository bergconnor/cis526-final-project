CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  subpage_id INTEGER,
  title TEXT,
  content TEXT,
  media TEXT,
  FOREIGN KEY (subpage_id) REFERENCES subpages(id)
);
