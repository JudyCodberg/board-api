const express = require("express");
const app = express();
const connection = require("./config/config.js");

// dummy data
const id = "id13";
const password = "1234";
const nickname = "test";
const title = "title";
const content = "this is content";
const writer = "writer";
const hits = 99;
const comment_count = 99;
const board_id = 3;
const searchTitle = title;
const searchContent = content;

app.get("/", (req, res) => {
  res.send("connected");
});

// id check
app.get("/checkid", (req, res) => {
  if (req["id"] == null) {
    res.json({ message: "no contents", statusCode: 403 });
  }
  const sql = `SELECT * FROM user WHERE user_id = '${id}'`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        if (rows == "") {
          res.json({
            message: "Avaliable Id",
          });
        } else {
          res.json({
            message: "Already Exist",
          });
        }
      }
    } catch (error) {
      res.json({
        message: "Unexpected Error",
        statusCode: 500,
      });
    }
  });
});

// nickname check
app.get("/checknick", (req, res) => {
  if (req["nickname"] == null) {
    res.json({ message: "no contents", statusCode: 403 });
  }
  const sql = `SELECT * FROM user WHERE nickname= '${nickname}'`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        if (rows == "") {
          res.json({
            message: "Avaliable nickname",
          });
        } else {
          res.json({
            message: "Already Exist",
          });
        }
      }
    } catch (error) {
      res.json({
        message: "Unexpected Error",
        statusCode: 500,
      });
    }
  });
});

// login
app.post("/login", (req, res) => {
  if (req["id"] == null || req["nickname"] == null) {
    res.json({ message: "no contents", statusCode: 403 });
  }
  const sql = `INSERT INTO user (user_id, nickname, password, createdAt, updatedAt) VALUES ('${id}', '${nickname}', '${password}', NOW(), NOW());`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        if (rows == "") {
          res.json({
            message: "Join Failed",
          });
        } else {
          res.json({
            message: "Join Success",
            data: rows,
          });
        }
      }
    } catch (error) {
      res.json({
        message: "Unexpected Error",
        statusCode: 500,
      });
    }
  });
});

// join
app.post("/join", (req, res) => {
  if (req["id"] == null || req["nickname"] == null || req["password"] == null) {
    res.json({ message: "no contents", statusCode: 403 });
  }
  const sql = `INSERT INTO user (user_id, nickname, password, createdAt, updatedAt) VALUES ('${id}', '${nickname}', '${password}', NOW(), NOW());`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        if (rows == "") {
          res.json({
            message: "Join Failed",
          });
        } else {
          res.json({
            message: "Join Success",
            data: rows,
          });
        }
      }
    } catch (error) {
      res.json({
        message: "Unexpected Error",
        statusCode: 500,
      });
    }
  });
});

// find password
app.get("/findpw", (req, res) => {
  const sql = `SELECT password FROM user WHERE user_id = '${id}';`;
  connection.query(sql, (error, rows) => {
    try {
      if (rows == undefined) {
        res.json({
          message: "no result",
        });
      } else if (res.statusCode === 200 && rows !== "") {
        let password = Object.values(JSON.parse(JSON.stringify(rows)))[0].password;
        res.json({
          message: "Password founded",
          data: password,
        });
      }
    } catch (error) {
      res.json({
        message: "Unexpected Error",
        statusCode: 500,
      });
    }
  });
});

// board list
app.get("/board", (req, res) => {
  const sql = "SELECT * from board";
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        res.json({
          message: "Success",
          data: rows,
        });
      }
    } catch (error) {
      res.json({
        message: "Unexpected Error",
        statusCode: 500,
      });
    }
  });
});

// write
app.post("/write", (req, res) => {
  const sql = `INSERT INTO board (title, content, hits, comment_count, writer, createdAt, updatedAt) VALUES ('${title}', '${content}', '${hits}', '${comment_count}','${writer}', NOW(), NOW());`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200 && rows !== "") {
        res.json({
          message: "Aritcle registered",
          data: rows,
        });
      }
    } catch (error) {
      res.json({
        message: "Unexpected Error",
        statusCode: 500,
      });
    }
  });
});

// detail
app.get(`/board/${board_id}`, (req, res) => {
  const sql = `SELECT * FROM board WHERE board_id = '${board_id}';`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        const info = Object.values(JSON.parse(JSON.stringify(rows)))[0];
        let data = res.json({
          message: "Success",
          data: info,
        });
      }
    } catch (error) {
      res.json({
        message: "Unexpected Error",
        statusCode: 500,
      });
    }
  });
});

// edit
app.post("/edit", (req, res) => {
  const sql = `UPDATE board SET title = '${title}',content = '${content}', updatedAt = CURRENT_TIMESTAMP WHERE board_id = '${board_id}';`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        res.json({
          message: "edit complete",
        });
      }
    } catch (error) {
      res.json({
        message: "Unexpected Error",
        statusCode: 500,
      });
    }
  });
});

// delete
app.get("/delete", (re, res) => {
  // if (req["id"] == null) {
  //   res.json({ message: "no contents", statusCode: 403 });
  // }
  const sql = `DELETE FROM board WHERE board_id = '${board_id}';`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        res.json({
          message: "delete",
        });
      }
    } catch (error) {
      res.json({
        message: "Unexpected Error",
        statusCode: 500,
      });
    }
  });
});

// search by title
app.get("/searchtitle", (req, res) => {
  const sql = `SELECT * FROM board WHERE title LIKE '%${searchTitle}%';`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        const result = Object.values(JSON.parse(JSON.stringify(rows)));
        res.json({
          message: "result",
          data: result,
        });
        if (rows == undefined) {
          res.json({
            message: "no result",
          });
        }
      }
    } catch (error) {
      res.json({
        message: "Unexpected Error",
        statusCode: 500,
      });
    }
  });
});

// search by content
app.get("/searchcontent", (req, res) => {
  const sql = `SELECT * FROM board WHERE title LIKE '%${searchContent}%';`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        const result = Object.values(JSON.parse(JSON.stringify(rows)));
        res.json({
          message: "result",
          data: result,
        });
        if (rows == undefined) {
          res.json({
            message: "no result",
          });
        }
      }
    } catch (error) {
      res.json({
        message: "Unexpected Error",
        statusCode: 500,
      });
    }
  });
});

// search by title+content
app.get("/search", (req, res) => {
  const sql = `SELECT * FROM board WHERE title LIKE '%${searchTitle}%' OR content LIKE '%${searchContent}%';`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        const result = Object.values(JSON.parse(JSON.stringify(rows)));
        res.json({
          message: "result",
          data: result,
        });
        if (rows == undefined) {
          res.json({
            message: "no result",
          });
        }
      }
    } catch (error) {
      res.json({
        message: "Unexpected Error",
        statusCode: 500,
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running");
});
