const connection = require("../config/config");

const query = (sql, values) => {
  // console.log("sql", sql);
  // console.log("values", values);
  return new Promise(function (resolve, reject) {
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

exports.boardCountAll = () => {
  const sql = "SELECT count(*) as count FROM board;";
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
        console.error(error);
      }
      resolve(Object.values(JSON.parse(JSON.stringify(result)))[0].count);
    });
  });
};

exports.countSearchTitle = (value) => {
  const sql = "SELECT COUNT(*) as count from board WHERE title LIKE ?";
  const values = `%${value}%`;
  return query(sql, values);
};

exports.searchTitle = (pageSize, pageNum, value) => {
  const sql = `SELECT * from board WHERE title LIKE ? LIMIT ?, ?;`;
  const values = [`%${value}%`, (pageNum - 1) * pageSize, pageSize];
  return query(sql, values);
};

exports.countSearchContent = (value) => {
  const sql = `SELECT COUNT(*) as count from board WHERE content LIKE ?`;
  const values = `%${value}%`;
  return query(sql, values);
};

exports.searchContent = (pageSize, pageNum, value) => {
  const sql = `SELECT * from board WHERE content LIKE ? LIMIT ?, ?;`;
  const values = [`%${value}%`, (pageNum - 1) * pageSize, pageSize];
  return query(sql, values);
};

exports.countSearchAll = (value) => {
  const sql = "SELECT COUNT(*) as count from board WHERE title LIKE ? OR content LIKE ?";
  const values = [`%${value}%`, `%${value}%`];
  return query(sql, values);
};

exports.searchAll = (pageSize, pageNum, value) => {
  const sql = `SELECT * from board WHERE title LIKE ? OR content LIKE ? LIMIT ?, ?;`;
  const values = [`%${value}%`, `%${value}%`, (pageNum - 1) * pageSize, pageSize];
  return query(sql, values);
};

exports.getList = (pageSize, pageNum) => {
  const sql = `SELECT * from board LIMIT ?, ?;`;
  const values = [(pageNum - 1) * pageSize, pageSize];
  return query(sql, values);
};

exports.detail = (boardId) => {
  const sql = `SELECT * FROM board WHERE board_id = ?`;
  const values = boardId;
  return query(sql, values);
};

exports.write = (title, content, writer) => {
  const sql =
    "INSERT INTO board (title, content, hits, comment_count, writer, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?)";
  const values = [title, content, 0, 0, writer, new Date(), new Date()];
  return query(sql, values);
};

exports.edit = (title, content, boardIndex) => {
  const sql = `UPDATE board SET title = ?,content = ?, updatedAt = CURRENT_TIMESTAMP WHERE board.board_id = ? ;`;
  const values = [title, content, boardIndex];
  return query(sql, values);
};

exports.checkBoardId = (boardId) => {
  const sql = `SELECT * FROM board WHERE board_id = ?`;
  const values = boardId;
  return query(sql, values);
};

exports.updateDelete = (boardId) => {
  const sql = `UPDATE board SET is_delete = 0 WHERE board_id =?;`;
  const values = boardId;
  return query(sql, values);
};
