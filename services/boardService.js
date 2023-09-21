const connection = require("../config/config");

exports.boardCountAll = () => {
  const sql = "SELECT count(*) as count FROM board;";
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(Object.values(JSON.parse(JSON.stringify(result)))[0].count);
    });
  });
};

exports.countSearchTitle = (value) => {
  const sql = `SELECT COUNT(*) as count from board WHERE title LIKE '%${value}%'`;
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(Object.values(JSON.parse(JSON.stringify(result)))[0].count);
    });
  });
};

exports.searchTitle = (pageSize, pageNum, countNum, value) => {
  const offset = (pageNum - 1) * pageSize;
  const sql = `SELECT * from board WHERE title LIKE '%${value}%' LIMIT ${offset}, ${pageSize};`;
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (error || pageSize * pageNum > countNum) {
        reject(error);
      }
      resolve(result);
    });
  });
};

exports.countSearchContent = (value) => {
  const sql = `SELECT COUNT(*) as count from board WHERE content LIKE '%${value}%'`;
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(Object.values(JSON.parse(JSON.stringify(result)))[0].count);
    });
  });
};

exports.searchContent = (pageSize, pageNum, countNum, value) => {
  const offset = (pageNum - 1) * pageSize;
  const sql = `SELECT * from board WHERE content LIKE '%${value}%' LIMIT ${offset}, ${pageSize};`;
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (error || pageSize * pageNum > countNum) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

exports.countSearchAll = (value) => {
  const sql = `SELECT COUNT(*) as count from board WHERE title LIKE '%${value}%' OR content LIKE '%${value}%'`;
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(Object.values(JSON.parse(JSON.stringify(result)))[0].count);
    });
  });
};

exports.searchAll = (pageSize, pageNum, countNum, value) => {
  const offset = (pageNum - 1) * pageSize;
  const sql = `SELECT * from board WHERE title LIKE '%${value}%' LIMIT ${offset}, ${pageSize};`;
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (error || pageSize * pageNum > countNum) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

exports.getList = (pageSize, pageNum) => {
  const offset = (pageNum - 1) * pageSize;
  const sql = `SELECT * from board LIMIT ${offset}, ${pageSize};`;
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

exports.detail = (boardId) => {
  const sql = `SELECT * FROM board WHERE board_id = ${boardId}`;
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(Object.values(JSON.parse(JSON.stringify(result))));
    });
  });
};

exports.write = (title, content, writer) => {
  const sql = `INSERT INTO board (title, content, hits, comment_count, writer, createdAt, updatedAt) VALUES ('${title}', '${content}',0, 0,'${writer}', NOW(), NOW());`;
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

exports.edit = (title, content, board_id, writer) => {
  const sql = `UPDATE board SET title = '${title}',content = '${content}', updatedAt = CURRENT_TIMESTAMP WHERE board.board_id = ${board_id} AND board.writer = '${writer}';`;
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

exports.checkBoardId = (boardId) => {
  const sql = `SELECT * FROM board WHERE board_id = ${boardId}`;
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (result.length === 0 || Object.values(JSON.parse(JSON.stringify(result)))[0].is_delete === 0) {
        reject(error);
      }
      resolve(result);
    });
  });
};

exports.updateDelete = (boardId) => {
  const sql = `UPDATE board SET is_delete = 0 WHERE board_id = ${boardId};`;
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (result.length === 0) {
        reject(error);
      }
      resolve(result);
    });
  });
};
