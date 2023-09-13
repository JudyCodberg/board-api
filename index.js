const express = require("express");
const app = express();
const connection = require("./config/config.js");

app.get("/", (req, res) => {
  res.send("connected");
});

// login
app.get("/login", (req, res) => {
  const sql = `SELECT * FROM user WHERE user_id = ${id} AND password = ${password};`;
  connection.query(sql, (error, rows) => {
    if (error) throw error;
    res.send(rows);
  });
});

// board list
app.get("/board", (req, res) => {
  const sql = "SELECT * from board";
  connection.query(sql, (error, rows) => {
    if (error) throw error;
    res.send(rows);
  });
});

app.listen(3000, () => {
  console.log("Server is running");
});
