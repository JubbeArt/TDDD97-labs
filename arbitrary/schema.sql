CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    firstname TEXT,
    familyname TEXT,
    password TEXT,
    city TEXT,
    country TEXT,
    gender BOOLEAN
);

CREATE TABLE IF NOT EXISTS tokens (
    token TEXT PRIMARY KEY,
    email TEXT,
    FOREIGN KEY (email) REFERENCES users (email)
);

CREATE TABLE IF NOT EXISTS  messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT,
    email TEXT,
    FOREIGN KEY (email) REFERENCES users (email)
);


INSERT INTO users VALUES ('a@a', 'a', 'a', 'aaaaaaaa', 'a', 'a', 1);
