const express = require("express");
const app = express();

const connection = require("./config/config.js");
const func = require("./response.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  func.response(res, "connected", 200, null);
});

// id check
app.get("/checkId/", (req, res) => {
  func.response(res, "error", 404, null);
});

app.get("/checkid/:id", (req, res) => {
  try {
    let paramsId = req.params.id.trim();
    if (paramsId.length == 0 || paramsId == null || paramsId == undefined) {
      func.response(res, "id invalidate", 400, null);
    } else {
      const sql = `SELECT * FROM user WHERE user_id = '${paramsId}'`;
      connection.query(sql, (error, rows) => {
        if (rows.length == 0) {
          func.response(res, "Avaliable Id", 200, null);
        } else {
          func.response(res, "Already Exist", 404, null);
        }
      });
    }
  } catch (error) {
    func.response(res, "error", 500, error);
  }
});

// nickname check
app.get("/checknick/", (req, res) => {
  func.response(res, "error", 404, null);
});

app.get("/checknick/:name", (req, res) => {
  try {
    let paramsName = req.params.name.trim();
    if (paramsName.length == 0 || paramsName == null || paramsName == undefined) {
      func.response(res, "nickname invalidate", 400, null);
    } else {
      const sql = `SELECT * FROM user WHERE nickname= '${paramsName}'`;
      connection.query(sql, (error, rows) => {
        if (rows.length == 0) {
          func.response(res, "Avaliable nickname", 200, null);
        } else {
          func.response(res, "Already Exist", 404, null);
        }
      });
    }
  } catch (error) {
    func.response(res, "Unexpected Error", 500, null);
  }
});

// login
app.post("/login", (req, res) => {
  try {
    const { id, password } = req.body;
    if (id == undefined || password == undefined) {
      func.response(res, "invalid value", 400, null);
    } else {
      const sql = `SELECT * FROM user WHERE user_id = '${id}' AND password = '${password}';`;
      connection.query(sql, (error, rows) => {
        try {
          if (rows.length == 0) {
            func.response(res, "user info does not exist", 404, null);
          } else {
            func.response(res, "Login Success", 200, null);
          }
        } catch (error) {
          func.response(res, "Unexpected Error", 500, error);
        }
      });
    }
  } catch (error) {
    func.response(res, "Unexpected Error", 500, error);
  }
});

// join
app.post("/join", (req, res) => {
  try {
    const { id, nickname, password } = req.body;
    if (id !== undefined && nickname !== undefined && password !== undefined) {
      const sql = `INSERT INTO user (user_id, nickname, password, createdAt, updatedAt) VALUES ('${id}', '${nickname}', '${makeHash}', NOW(), NOW());`;
      connection.query(sql, (error, rows) => {
        if (rows.length !== 0) {
          func.response(res, "Join Success", 200, null);
        } else {
          func.response(res, "Join Failed", 404, null);
        }
      });
    } else {
      func.response(res, "invalid value", 400, null);
    }
  } catch (error) {
    func.response(res, "Unexpected Error", 500, error);
  }
});

// find password
app.get("/findpw/", (req, res) => {
  res.sendStatus(404);
});

app.get("/findpw/:id", (req, res) => {
  try {
    let paramsId = req.params.id.trim();
    if (paramsId == undefined || paramsId == null) {
      func.response(res, "invalid value", 400, null);
    } else {
      const sql = `SELECT password FROM user WHERE user_id = '${paramsId}';`;
      connection.query(sql, (error, rows) => {
        if (rows.length == 0) {
          func.response(res, "no result", 404, null);
        } else {
          let password = Object.values(JSON.parse(JSON.stringify(rows)))[0].password;
          func.response(res, "Password founded", 200, password);
        }
      });
    }
  } catch (error) {
    func.response(res, "Unexpected Error", 500, null);
  }
});

// board list
app.get("/board", (req, res) => {
  try {
    const pageSize = req.query.page; // 한 페이지마다 보여줄 글 개수
    const pageNum = req.query.num; // 현재 페이지 번호(1페이지, 2페이지..), offset
    const searchTitle = req.query.title;
    const searchContent = req.query.content;
    const offset = (pageNum - 1) * pageSize;
    if (pageNum <= 0 || pageSize <= 0 || pageNum == undefined || pageSize == undefined) {
      func.response(res, "invalid parameter", 400, null);
    } else {
      const sql = "SELECT count(*) as count FROM board;";
      connection.query(sql, (err, rows) => {
        const countArticle = JSON.parse(JSON.stringify(rows))[0].count;
        if (pageSize > countArticle - 1) {
          func.response(res, "no data", 400, null);
        } else {
          // 제목 으로 검색
          if (searchTitle !== undefined && searchContent == undefined) {
            const sql = `SELECT COUNT(*) as count from board WHERE title LIKE '%${searchTitle}%'`;
            connection.query(sql, (error, rows) => {
              const countResult = JSON.parse(JSON.stringify(rows))[0].count;
              if (Math.ceil(countResult / pageSize) >= pageNum) {
                const sql = `SELECT * from board WHERE title LIKE '%${searchTitle}%' LIMIT ${offset}, ${pageSize};`;
                connection.query(sql, (error, rows) => {
                  if (res.statusCode === 200) {
                    if (pageSize > countResult - 1) {
                      func.response(res, "no title result", 400, null);
                    } else {
                      func.response(res, "Success", 200, { rows, countResult });
                    }
                  } else {
                    func.response(res, "no list", 400, null);
                  }
                });
              } else {
                func.response(res, "no list", 400, null);
              }
            });
          }
          // 내용 으로 검색
          else if (searchContent !== undefined && searchTitle == undefined) {
            const sql = `SELECT COUNT(*) as count from board WHERE title LIKE '%${searchContent}%'`;
            connection.query(sql, (error, rows) => {
              const countResult = JSON.parse(JSON.stringify(rows))[0].count;
              if (Math.ceil(countResult / pageSize) >= pageNum) {
                const sql = `SELECT * from board WHERE content LIKE '%${searchContent}%' LIMIT ${offset}, ${pageSize};`;
                connection.query(sql, (error, rows) => {
                  if (res.statusCode === 200) {
                    if (pageSize > countResult - 1) {
                      func.response(res, "no content result", 400, null);
                    } else {
                      func.response(res, "Success", 200, { rows, countResult });
                    }
                  } else {
                    func.response(res, "no lissdsdsdsd", 400, null);
                  }
                });
              } else {
                func.response(res, "no list", 400, null);
              }
            });
          }
          // 제목 + 내용 으로 검색
          else if (searchContent !== undefined && searchTitle !== undefined) {
            const sql = `SELECT COUNT(*) as count from board WHERE title LIKE '%${searchTitle}%' OR content LIKE '%${searchContent}%'`;
            connection.query(sql, (error, rows) => {
              const countResult = JSON.parse(JSON.stringify(rows))[0].count;
              if (Math.ceil(countResult / pageSize) >= pageNum) {
                const sql = `SELECT * from board WHERE title LIKE '%${searchTitle}%' OR content LIKE '%${searchContent}%' LIMIT ${offset}, ${pageSize};`;
                connection.query(sql, (error, rows) => {
                  if (res.statusCode === 200) {
                    if (pageSize > countResult - 1) {
                      func.response(res, "no result", 400, null);
                    } else {
                      func.response(res, "Success", 200, { rows, countResult });
                    }
                  } else {
                    func.response(res, "no list", 400, null);
                  }
                });
              } else {
                func.response(res, "no list", 400, null);
              }
            });
          }
          // 일반 페이징
          else {
            if (Math.ceil(countArticle / pageSize) >= pageNum && pageNum !== undefined && pageNum > 0) {
              const sql = `SELECT * from board LIMIT ${offset}, ${pageSize};`;
              connection.query(sql, (error, rows) => {
                if (res.statusCode === 200) {
                  func.response(res, "Success", 200, { rows, countArticle });
                } else {
                  func.response(res, "no list", 400, null);
                }
              });
            } else {
              func.response(res, "no list", 400, null);
            }
          }
        }
      });
    }
  } catch (error) {
    func.response(res, "Unexpected Error", 500, null);
  }
});

// write
app.post("/write", (req, res) => {
  try {
    const { title, content, writer } = req.body;
    if (title !== undefined && content !== undefined && writer !== undefined) {
      const sql = `INSERT INTO board (title, content, hits, comment_count, writer, createdAt, updatedAt) VALUES ('${title}', '${content}',0, 0,'${writer}', NOW(), NOW());`;
      connection.query(sql, (error, rows) => {
        if (rows.length !== 0) {
          func.response(res, "Success", 200, rows);
        }
      });
    } else {
      func.response(res, "invalid value", 400, null);
    }
  } catch (error) {
    func.response(res, "Unexpected Error", 500, null);
  }
});

// detail
app.get(`/board/`, (req, res) => {
  res.sendStatus(404);
});

app.get(`/board/:id`, (req, res) => {
  try {
    let paramsId = req.params.id.trim();
    if (paramsId == null && paramsId == undefined) {
      func.response(res, "invalid value", 400, null);
    }
    const checkId = `SELECT * FROM board WHERE board_id = '${paramsId}'`;
    connection.query(checkId, (error, rows) => {
      if (rows.length === 0) {
        func.response(res, "board_id is not founded", 404, null);
      } else {
        connection.query(checkId, (error, rows) => {
          if (rows !== 0 && res.statusCode === 200) {
            const detail = Object.values(JSON.parse(JSON.stringify(rows)))[0];
            func.response(res, "Success", 200, detail);
          }
          func.response(res, "Unexpected Error", 500, null);
        });
      }
    });
  } catch (error) {
    func.response(res, "Unexpected Error", 500, null);
  }
});

// edit
app.post("/edit", (req, res) => {
  try {
    const { title, content, board_id } = req.body;
    if (title !== undefined && content !== undefined && board_id !== undefined) {
      const sql = `UPDATE board SET title = '${title}',content = '${content}', updatedAt = CURRENT_TIMESTAMP WHERE board_id = '${board_id}';`;
      connection.query(sql, (error, rows) => {
        if (rows !== 0 && res.statusCode === 200) {
          func.response(res, "edit complete", 200, null);
        }
      });
    } else {
      func.response(res, "invalid value", 400, null);
    }
  } catch (error) {
    func.response(res, "Unexpected Error", 500, null);
  }
});

// delete
app.get("/delete/:id", (req, res) => {
  try {
    let paramsId = req.params.id.trim();
    if (!paramsId) {
      func.response(res, "invalid value", 400, null);
    }
    const checkId = `SELECT * FROM board WHERE board_id = '${paramsId}'`;
    connection.query(checkId, (error, rows) => {
      if (rows.length === 0) {
        func.response(res, "board_id is not foundede", 404, null);
      } else {
        const sql = `UPDATE board SET isDelete = 0 WHERE board_id = '${paramsId}';`;
        connection.query(sql, (error, rows) => {
          try {
            func.response(res, "Delete successful", 200, null);
          } catch (error) {
            func.response(res, "Unexpected Error", 500, null);
          }
        });
      }
    });
  } catch (error) {
    func.response(res, "Unexpected Error", 500, null);
  }
});

app.listen(3000, () => {
  console.log("Server is running");
});
