const sqlite3 = require("sqlite3").verbose();

const createTable = () => {
  console.log("create database table users");
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER ,  username TEXT NOT NULL, password TEXT NOT NULL, firstName TEXT, lastName TEXT,  email TEXT, address TEXT, contactNumber TEXT, city TEXT, state TEXT, avatar TEXT,  PRIMARY KEY (username), UNIQUE(username))"
  );
};

let db = new sqlite3.Database("./dbTaiChinh.sqlite3", (err) => {
  if (err) {
    console.log("Error when creating the database", err);
  } else {
    console.log("Database created!");
    /* Put code to create table(s) here */
    createTable();
  }
});

// db.run("DROP TABLE IF EXISTS users");

db.run("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)", [
  "lanMochi",
  "mochi123"
]);
db.run("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)", [
  "testSignUp",
  "test123"
]);
db.run("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)", [
  "fargin",
  "prince"
]);
// db.run(
//   "INSERT OR IGNORE INTO users (username, password, avatar) VALUES (?, ?, ?)",
//   [
//     "thao",
//     "thao123",
//     "https://cdn1.iconfinder.com/data/icons/shiba-inu/500/Shiba_Inu_Emoticon-09-512.png"
//   ]
// );

module.exports = db;
