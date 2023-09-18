const express = require("express");
const app = express();
const connection = require("./config/config.js");

const PAGE_NUM = 15;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("connected");
});

// id check
// id params 없을 때
app.get("/checkId/", (req, res) => {
  res.sendStatus(404);
});
app.get("/checkid/:id", (req, res) => {
  let paramsId = req.params.id.trim();
  if (paramsId.length == 0 || paramsId == null || undefined) {
    res.status(400).json({
      message: "id invalidate",
      statusCode: 400,
    });
  } else {
    const sql = `SELECT * FROM user WHERE user_id = '${paramsId}'`;
    connection.query(sql, (error, rows) => {
      try {
        if (rows.length == 0) {
          res.json({
            message: "Avaliable Id",
            statusCode: 200,
          });
        } else {
          res.status(404).json({
            message: "Already Exist",
            statusCode: 404,
          });
        }
      } catch (error) {
        res.status(500).json({
          message: error,
        });
      }
    });
  }
});

// nickname check
app.get("/checknick/", (req, res) => {
  res.sendStatus(404);
});
app.get("/checknick/:name", (req, res) => {
  let paramsName = req.params.name.trim();
  if (paramsName.length == 0 || paramsName == null || undefined) {
    res.status(400).json({
      message: "nickname invalidate",
      statusCode: 400,
    });
  } else {
    const sql = `SELECT * FROM user WHERE nickname= '${paramsName}'`;
    connection.query(sql, (error, rows) => {
      try {
        if (rows.length == 0) {
          res.json({
            message: "Avaliable nickname",
            statusCode: 200,
          });
        } else {
          res.status(404).json({
            message: "Already Exist",
            statusCode: 404,
          });
        }
      } catch (error) {
        res.json({
          message: "Unexpected Error",
          statusCode: 500,
        });
      }
    });
  }
});

// login
app.post("/login", (req, res) => {
  const { id, password } = req.body;
  if (id == undefined || password == undefined) {
    res.status(400).json({
      message: "invalid value",
      statusCode: 400,
    });
  } else {
    const sql = `SELECT * FROM user WHERE user_id = '${id}' AND password = '${password}';`;
    connection.query(sql, (error, rows) => {
      try {
        if (rows.length == 0) {
          res.status(404).json({
            message: "user info does not exist",
            statusCode: 404,
          });
        } else {
          res.json({
            message: "Login Success",
            statusCode: 200,
          });
        }
      } catch (error) {
        res.json({
          message: "Unexpected Error",
          statusCode: 500,
        });
      }
    });
  }
});

// join
app.post("/join", (req, res) => {
  const { id, nickname, password } = req.body;
  if (id !== undefined && nickname !== undefined && password !== undefined) {
    const sql = `INSERT INTO user (user_id, nickname, password, createdAt, updatedAt) VALUES ('${id}', '${nickname}', '${password}', NOW(), NOW());`;
    connection.query(sql, (error, rows) => {
      try {
        if (rows.length !== 0) {
          res.json({
            message: "Join Success",
            statusCode: 200,
          });
        } else {
          res.state(404).json({
            message: "Join Failed",
            statusCode: 404,
          });
        }
      } catch (error) {
        res.json({
          message: "Unexpected Error",
          statusCode: 500,
        });
      }
    });
  } else {
    res.status(400).json({
      message: "invalid value",
      statusCode: 400,
    });
  }
});

// find password
app.get("/findpw/", (req, res) => {
  res.sendStatus(404);
});
app.get("/findpw/:id", (req, res) => {
  let paramsId = req.params.id.trim();
  if (paramsId == undefined || null) {
    res.status(400).json({
      message: "invalid value",
      statusCode: 400,
    });
  } else {
    const sql = `SELECT password FROM user WHERE user_id = '${paramsId}';`;
    connection.query(sql, (error, rows) => {
      try {
        if (rows.length == 0) {
          res.status(404).json({
            message: "no result",
            statusCode: 404,
          });
        } else {
          let password = Object.values(JSON.parse(JSON.stringify(rows)))[0].password;
          res.json({
            message: "Password founded",
            statusCode: 200,
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
  }
});

// board list
app.get("/board", (req, res) => {
  const allPage = connection.query("SELECT count(*) as count FROM board;", (err, rows) => {
    const countArticle = JSON.parse(JSON.stringify(rows))[0].count;
    console.log(Math.ceil(countArticle / PAGE_NUM));
  });

  const pageNum = req.query.page;
  const sql = `SELECT * from board LIMIT ${pageNum}, ${PAGE_NUM};`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        res.status(200).json({
          message: "Success",
          data: rows,
        });
      } else {
        res.status(400).json({
          message: "no list",
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

// search
app.get("/search", (req, res) => {
  const pageNum = req.query.page;
  const searchTitle = req.query.title;
  const searchContent = req.query.content;
  const sql = `SELECT * from board WHERE title LIKE '%${searchTitle}%' AND content LIKE '%${searchContent}%' LIMIT ${PAGE_NUM};`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        res.status(200).json({
          message: "Success",
          data: rows,
        });
      } else {
        res.status(400).json({
          message: "no list",
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
  const { title, content, writer } = req.body;
  if (title !== undefined && content !== undefined && writer !== undefined) {
    const sql = `INSERT INTO board (title, content, hits, comment_count, writer, createdAt, updatedAt) VALUES ('${title}', '${content}',0, 0,'${writer}', NOW(), NOW());`;
    connection.query(sql, (error, rows) => {
      try {
        if (rows.length !== 0) {
          res.json({
            message: "success",
            statusCode: 200,
          });
        }
      } catch (error) {
        res.json({
          message: "Unexpected Error",
          statusCode: 500,
        });
      }
    });
  } else {
    res.status(400).json({
      message: "invalid value",
      statusCode: 400,
    });
  }
});

// detail
app.get(`/board/`, (req, res) => {
  res.sendStatus(404);
});
app.get(`/board/:id`, (req, res) => {
  let paramsId = req.params.id.trim();
  if (paramsId == null || undefined) {
    res.status(400).json({
      message: "invalid value",
      statusCode: 400,
    });
  }
  const checkId = `SELECT * FROM board WHERE board_id = '${paramsId}'`;
  connection.query(checkId, (error, rows) => {
    try {
      if (rows.length === 0) {
        res.status(404).json({
          message: "board_id is not founded",
          statusCode: 404,
        });
      } else {
        const sql = `SELECT * FROM board WHERE board_id = '${paramsId}';`;
        connection.query(sql, (error, rows) => {
          try {
            if (rows !== 0 && res.statusCode === 200) {
              const detail = Object.values(JSON.parse(JSON.stringify(rows)))[0];
              res.json({
                message: "Success",
                statusCode: 200,
                data: detail,
              });
            }
          } catch (error) {
            res.json({
              message: "Unexpected Error",
              statusCode: 500,
            });
          }
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Unexpected Error",
        statusCode: 500,
      });
    }
  });
});

// edit
app.post("/edit", (req, res) => {
  const { title, content, board_id } = req.body;
  if (title !== undefined && content !== undefined && board_id !== undefined) {
    const sql = `UPDATE board SET title = '${title}',content = '${content}', updatedAt = CURRENT_TIMESTAMP WHERE board_id = '${board_id}';`;
    connection.query(sql, (error, rows) => {
      try {
        if (rows !== 0 && res.statusCode === 200) {
          res.json({
            message: "edit complete",
            statusCode: 200,
          });
        }
      } catch (error) {
        res.json({
          message: "Unexpected Error",
          statusCode: 500,
        });
      }
    });
  } else {
    res.status(400).json({
      message: "invalid value",
      statusCode: 400,
    });
  }
});

// delete
app.get("/delete/:id", (req, res) => {
  let paramsId = req.params.id.trim();
  if (!paramsId) {
    res.status(400).json({
      message: "Invalid value",
      statusCode: 400,
    });
  }
  const checkId = `SELECT * FROM board WHERE board_id = '${paramsId}'`;
  connection.query(checkId, (error, rows) => {
    try {
      if (rows.length === 0) {
        res.status(404).json({
          message: "board_id is not founded",
          statusCode: 404,
        });
      } else {
        const sql = `DELETE FROM board WHERE board_id = '${paramsId}'`;
        connection.query(sql, (error, rows) => {
          try {
            res.status(200).json({
              message: "Delete successful",
              statusCode: 200,
            });
          } catch (error) {
            return res.status(500).json({
              message: "Unexpected Error",
              statusCode: 500,
            });
          }
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Unexpected Error",
        statusCode: 500,
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running");
});
