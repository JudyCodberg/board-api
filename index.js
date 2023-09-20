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
app.get("/checkid/", (req, res) => {
  func.response(res, "no checking ID", 404, null);
});

app.get("/checkid/:id", (req, res) => {
  try {
    let paramsId = req.params.id.trim();
    if (paramsId.length == 0 || paramsId == undefined) {
      func.response(res, "id invalidate", 400, null);
    } else {
      const sql = `SELECT * FROM user WHERE account = '${paramsId}'`;
      connection.query(sql, (error, result) => {
        if (result.length == 0) {
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
  func.response(res, "no checking nickname", 404, null);
});

app.get("/checknick/:name", (req, res) => {
  try {
    let paramsName = req.params.name.trim();
    if (paramsName.length == 0 || paramsName == undefined) {
      func.response(res, "nickname invalidate", 400, null);
    } else {
      const sql = `SELECT * FROM user WHERE nickname= '${paramsName}'`;
      connection.query(sql, (error, result) => {
        if (result.length == 0) {
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

// join
app.post("/join", (req, res) => {
  try {
    const { id, nickname, password } = req.body;
    if (
      id !== undefined &&
      nickname !== undefined &&
      password !== undefined &&
      id.length !== 0 &&
      nickname.length !== 0 &&
      password.length !== 0
    ) {
      const sql = `INSERT INTO user (account, nickname, password, createdAt, updatedAt) VALUES ('${id}', '${nickname}', '${password}', NOW(), NOW());`;
      connection.query(sql, (error, result) => {
        if (result.length !== 0) {
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

// login
app.post("/login", (req, res) => {
  try {
    const { id, password } = req.body;
    if (id == undefined || password == undefined || id.length == 0 || password.length == 0) {
      func.response(res, "invalid value", 400, null);
    } else {
      const sql = `SELECT * FROM user WHERE account = '${id}' AND password = '${password}';`;
      connection.query(sql, (error, result) => {
        try {
          if (result.length == 0) {
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
// find password
app.get("/findpw/", (req, res) => {
  func.response(res, "no checking password", 404, null);
});

app.get("/findpw/:id", (req, res) => {
  try {
    let paramsId = req.params.id.trim();
    if (paramsId == undefined || paramsId.length == 0) {
      func.response(res, "invalid value", 400, null);
    } else {
      const sql = `SELECT password FROM user WHERE account = '${paramsId}';`;
      connection.query(sql, (error, result) => {
        if (result.length == 0) {
          func.response(res, "no result", 404, null);
        } else {
          let password = Object.values(JSON.parse(JSON.stringify(result)))[0].password;
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
    const pageSize = req.query.num; // 한 페이지마다 보여줄 글 개수
    const pageNum = req.query.page; // 현재 페이지 번호(1페이지, 2페이지..), offset

    const target = req.query.target;
    const value = req.query.value;
    const offset = (pageNum - 1) * pageSize;
    if (pageNum <= 0 || pageSize <= 0 || pageNum == undefined || pageSize == undefined) {
      func.response(res, "invalid parameter", 400, null);
    } else {
      const sql = "SELECT count(*) as count FROM board;";
      connection.query(sql, (err, result) => {
        const countArticle = JSON.parse(JSON.stringify(result))[0].count;
        if (pageSize > countArticle - 1) {
          func.response(res, "no data", 400, null);
        } else if (target !== undefined && target.length > 0) {
          if (value !== undefined || value.length > 0) {
            if (target == 0) {
              const sql = `SELECT COUNT(*) as count from board WHERE title LIKE '%${value}%'`;
              connection.query(sql, (error, result) => {
                const countResult = JSON.parse(JSON.stringify(result))[0].count;
                const sql = `SELECT * from board WHERE title LIKE '%${value}%' LIMIT ${offset}, ${pageSize};`;
                connection.query(sql, (error, result) => {
                  if (res.statusCode === 200) {
                    if (pageSize * pageNum > countResult) {
                      func.response(res, "there is no more data", 400, countResult);
                    } else {
                      func.response(res, "Success", 200, { result, countResult });
                    }
                  } else {
                    func.response(res, "no list", 400, null);
                  }
                });
              });
            } else if (target == 1) {
              const sql = `SELECT COUNT(*) as count from board WHERE content LIKE '%${value}%'`;
              connection.query(sql, (error, result) => {
                const countResult = JSON.parse(JSON.stringify(result))[0].count;
                const sql = `SELECT * from board WHERE content LIKE '%${value}%' LIMIT ${offset}, ${pageSize};`;
                connection.query(sql, (error, result) => {
                  if (res.statusCode === 200) {
                    if (pageSize * pageNum > countResult) {
                      func.response(res, "there is no more data", 400, countResult);
                    } else {
                      func.response(res, "Success", 200, { result, countResult });
                    }
                  } else {
                    func.response(res, "no list", 400, null);
                  }
                });
              });
            } else if (target == 2) {
              const sql = `SELECT COUNT(*) as count from board WHERE title LIKE '%${value}%' OR content LIKE '%${value}%'`;
              connection.query(sql, (error, result) => {
                const countResult = JSON.parse(JSON.stringify(result))[0].count;
                const sql = `SELECT * from board WHERE title LIKE '%${value}%' OR content LIKE '%${value}%' LIMIT ${offset}, ${pageSize};`;
                connection.query(sql, (error, result) => {
                  if (res.statusCode === 200) {
                    if (pageSize * pageNum > countResult) {
                      func.response(res, "there is no more data", 400, countResult);
                    } else {
                      func.response(res, "Success", 200, { result, countResult });
                    }
                  } else {
                    func.response(res, "no list", 400, null);
                  }
                });
              });
            }
          } else {
            func.response(res, "no search value", 400, null);
          }
        } else {
          if (Math.ceil(countArticle / pageSize) >= pageNum && target == undefined) {
            const sql = `SELECT * from board LIMIT ${offset}, ${pageSize};`;
            connection.query(sql, (error, result) => {
              if (res.statusCode === 200) {
                func.response(res, "Success", 200, { result, countArticle });
              } else {
                func.response(res, "no list", 400, null);
              }
            });
          } else {
            func.response(res, "no list", 400, null);
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
    if (
      title !== undefined &&
      content !== undefined &&
      writer !== undefined &&
      title.length !== 0 &&
      content.length !== 0 &&
      writer.length !== 0
    ) {
      const sql = `INSERT INTO board (title, content, hits, comment_count, writer, createdAt, updatedAt) VALUES ('${title}', '${content}',0, 0,'${writer}', NOW(), NOW());`;
      connection.query(sql, (error, result) => {
        if (result.length !== 0) {
          func.response(res, "Success", 200, result);
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
  func.response(res, "invalid value", 404, null);
});

app.get(`/board/:id`, (req, res) => {
  try {
    let paramsId = req.params.id.trim();
    if (paramsId == undefined || paramsId.length == 0) {
      func.response(res, "invalid value", 400, null);
    } else {
      const checkId = `SELECT * FROM board WHERE board_id = ${paramsId}`;
      connection.query(checkId, (error, result) => {
        if (result.length === 0) {
          func.response(res, "board_id is not founded", 404, null);
        } else {
          const detail = Object.values(JSON.parse(JSON.stringify(result)))[0];
          func.response(res, "Success", 200, detail);
        }
      });
    }
  } catch (error) {
    func.response(res, "Unexpected Error", 500, null);
  }
});

// edit
app.post("/edit", (req, res) => {
  try {
    const { title, content, board_id, writer } = req.body;
    if (
      title !== undefined &&
      content !== undefined &&
      board_id !== undefined &&
      writer !== undefined &&
      title.length !== 0 &&
      content.length !== 0 &&
      board_id.length !== 0 &&
      writer.length !== 0
    ) {
      const sql = `UPDATE board SET title = '${title}',content = '${content}', updatedAt = CURRENT_TIMESTAMP WHERE board.board_id = ${board_id} AND board.writer = '${writer}';`;
      connection.query(sql, (error, result) => {
        if (result !== 0 && res.statusCode === 200) {
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

app.get(`/delete/`, (req, res) => {
  func.response(res, "invalid value", 404, null);
});
// delete
app.get("/delete/:id", (req, res) => {
  try {
    let paramsId = req.params.id.trim();
    if (paramsId == undefined || paramsId.length == 0) {
      func.response(res, "invalid value", 400, null);
    }
    const checkId = `SELECT * FROM board WHERE board_id = '${paramsId}'`;
    connection.query(checkId, (error, result) => {
      if (result.length === 0) {
        func.response(res, "board_id is not foundede", 404, null);
      } else {
        const sql = `UPDATE board SET isDelete = 0 WHERE board_id = '${paramsId}';`;
        connection.query(sql, (error, result) => {
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

// 댓글 작성
// app.post("/comment_write", (req, res) => {
//   try {
//     const { board_id, comment_content, nickname } = req.body;
//     if (board_id !== undefined && comment_content !== undefined && nickname !== undefined) {
//       const sql = `INSERT INTO comment (board_id, comment_content, nickname, createdAt, updatedAt) VALUES (${board_id}, '${comment_content}', '${nickname}', NOW(), NOW());`;
//       connection.query(sql, (error, result) => {
//         if (result.length !== 0) {
//           func.response(res, "Success", 200, result);
//         }
//       });
//     }
//   } catch (error) {
//     func.response(res, "Unexpected Error", 500, null);
//   }
// });

// // 댓글 수정
// app.post("/comment_edit", (req, res) => {
//   try {
//     const { comment_id, comment_content, nickname } = req.body;
//     if (comment_id !== undefined && comment_content !== undefined && nickname !== undefined) {
//       const sql = `UPDATE board SET comment_content = '${comment_content}', updatedAt = CURRENT_TIMESTAMP WHERE comment_id = '${comment_id}' AND nickname = '${nickname}';`;
//       connection.query(sql, (error, result) => {
//         console.log(result);
//         if (result !== 0 && res.statusCode === 200) {
//           func.response(res, "edit complete", 200, null);
//         }
//       });
//     } else {
//       func.response(res, "invalid value", 400, null);
//     }
//   } catch (error) {
//     func.response(res, "Unexpected Error", 500, null);
//   }
// });
// // 댓글 불러오기
// app.get("/comment/:id", (req, res) => {
//   try {
//     let boardId = req.params.id.trim();
//     if (boardId == undefined) {
//       func.response(res, "invalid value", 400, null);
//     } else {
//       const sql = `SELECT * FROM board LEFT JOIN comment ON board.board_id = comment.board_id WHERE board.board_id = ${boardId};`;
//       connection.query(sql, (error, result) => {
//         if (Object.values(JSON.parse(JSON.stringify(result)))[0].board_id == null) {
//           func.response(res, "invalid value", 400, null);
//         } else {
//           func.response(res, "Success", 200, result);
//         }
//       });
//     }
//   } catch (error) {
//     func.response(res, "Unexpected Error", 500, error);
//   }
// });

app.listen(3000, () => {
  console.log("Server is running");
});
