const express = require("express");
const app = express();
const connection = require("./config/config.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("connected");
});

// id check
app.get("/checkid/:id", (req, res) => {
  if (req.params.id == null || undefined) {
    res.status(400).json({
      message: "id invalidate",
    });
  }

  // res.status(200).json({
  //   message: req.params.id,
  // });

  const sql = `SELECT * FROM user WHERE user_id = '${req.params.id}'`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        if (rows.length == 0) {
          res.status(200).json({
            message: "Avaliable Id",
          });
        } else {
          res.status(400).json({
            message: "Already Exist",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  });
});

// nickname check
app.get("/checknick/:name", (req, res) => {
  if (req.params.name == null || undefined) {
    res.status(400).json({
      message: "nickname invalidate",
    });
  }
  const checkName = req.params.name;
  const sql = `SELECT * FROM user WHERE nickname= '${checkName}'`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        if (rows.length == 0) {
          res.status(200).json({
            message: "Avaliable nickname",
          });
        } else {
          res.status(400).json({
            message: "Already Exist",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        message: "Unexpected Error",
      });
    }
  });
});

// login
app.post("/login", (req, res) => {
  const { id, password } = req.body;
  if (id == undefined || password == undefined) {
    res.status(400).json({
      message: "invalid value",
    });
  }
  const sql = `SELECT * FROM user WHERE user_id = '${id}' AND password = '${password}';`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        if (rows.length == 0) {
          res.status(400).json({
            message: "Login failed",
          });
        } else {
          res.status(200).json({
            message: "Login Success",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        message: "Unexpected Error",
      });
    }
  });
});

// join
app.post("/join", (req, res) => {
  const { id, nickname, password } = req.body;
  if (id == undefined || nickname == undefined || password == undefined) {
    res.status(400).json({
      message: "invalid value",
    });
  }
  const sql = `INSERT INTO user (user_id, nickname, password, createdAt, updatedAt) VALUES ('${id}', '${nickname}', '${password}', NOW(), NOW());`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        res.status(200).json({
          message: "Join Success",
        });
        if (rows.length == 0) {
          res.status(400).json({
            message: "Join Failed",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        message: "Unexpected Error",
      });
    }
  });
});

// find password
app.get("/findpw/:id", (req, res) => {
  if (req.params.id == undefined) {
    res.status(400).json({
      message: "invalid value",
    });
  }
  const sql = `SELECT password FROM user WHERE user_id = '${req.params.id}';`;
  connection.query(sql, (error, rows) => {
    try {
      if (rows == undefined) {
        res.status(400).json({
          message: "no result",
        });
      } else if (res.statusCode === 200 && rows.length !== 0) {
        let password = Object.values(JSON.parse(JSON.stringify(rows)))[0].password;
        res.status(200).json({
          message: "Password founded",
          data: password,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Unexpected Error",
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
      res.status(500).json({
        message: "Unexpected Error",
      });
    }
  });
});

// write
app.post("/write", (req, res) => {
  const { title, content, writer } = req.body;
  if (title == undefined || content == undefined || writer == undefined) {
    res.status(400).json({
      message: "invalid value",
    });
  }
  const sql = `INSERT INTO board (title, content, hits, comment_count, writer, createdAt, updatedAt) VALUES ('${title}', '${content}',0, 0,'${writer}', NOW(), NOW());`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200 && rows.length !== 0) {
        res.status(200).json({
          message: "success",
          data: rows,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Unexpected Error",
      });
    }
  });
});

// detail
app.get(`/board/:id`, (req, res) => {
  if (req.params.id == null || undefined) {
    res.status(400).json({
      message: "invalid value",
    });
  }
  const sql = `SELECT * FROM board WHERE board_id = '${req.params.id}';`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        const detail = Object.values(JSON.parse(JSON.stringify(rows)))[0];
        res.status(200).json({
          message: "Success",
          data: detail,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Unexpected Error",
      });
    }
  });
});

// edit
app.post("/edit", (req, res) => {
  const { title, content, board_id } = req.body;
  if (title == undefined || content == undefined || board_id == undefined) {
    res.status(400).json({
      message: "invalid value",
    });
  }
  const sql = `UPDATE board SET title = '${title}',content = '${content}', updatedAt = CURRENT_TIMESTAMP WHERE board_id = '${board_id}';`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        res.status(200).json({
          message: "edit complete",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Unexpected Error",
      });
    }
  });
});

// delete
app.get("/delete/:id", (req, res) => {
  if (req.params.id == null || undefined) {
    res.status(400).json({
      message: "invalid value",
    });
  }
  const sql = `DELETE FROM board WHERE board_id = '${req.params.id}';`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        res.status(200).json({
          message: "delete",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Unexpected Error",
      });
    }
  });
});

// search by title
app.get("/searchtitle/:title", (req, res) => {
  if (req.params.title == null || undefined) {
    res.status(400).json({
      message: "invalid value",
    });
  }
  const sql = `SELECT * FROM board WHERE title LIKE '%${req.params.title}%';`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        const result = Object.values(JSON.parse(JSON.stringify(rows)));
        res.status(200).json({
          message: "result",
          data: result,
        });
        if (rows == undefined) {
          res.status(200).json({
            message: "no result",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        message: "Unexpected Error",
      });
    }
  });
});

// search by content
app.get("/searchcontent/:content", (req, res) => {
  if (req.params.content == null || undefined) {
    res.status(400).json({
      message: "invalid value",
    });
  }
  const sql = `SELECT * FROM board WHERE title LIKE '%${req.params.content}%';`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        const result = Object.values(JSON.parse(JSON.stringify(rows)));
        res.status(200).json({
          message: "result",
          data: result,
        });
        if (rows == undefined) {
          res.status(200).json({
            message: "no result",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        message: "Unexpected Error",
      });
    }
  });
});

// search by title+content
app.get("/search/:all", (req, res) => {
  if (req.params.all == null || undefined) {
    res.status(400).json({
      message: "invalid value",
    });
  }
  const sql = `SELECT * FROM board WHERE title LIKE '%${req.params.all}%' OR content LIKE '%${req.params.all}%';`;
  connection.query(sql, (error, rows) => {
    try {
      if (res.statusCode === 200) {
        const result = Object.values(JSON.parse(JSON.stringify(rows)));
        res.status(200).json({
          message: "result",
          data: result,
        });
        if (rows == undefined) {
          res.status(200).json({
            message: "no result",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        message: "Unexpected Error",
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running");
});
