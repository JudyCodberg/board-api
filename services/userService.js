const connection = require("../config/config");
const query = (sql, values) => {
  return new Promise(function (resolve, reject) {
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

exports.checkId = (userId) => {
  const sql = `SELECT * FROM user WHERE account = ?`;
  const values = userId;
  return query(sql, values);
};

exports.checkName = (nickname) => {
  const sql = `SELECT * FROM user WHERE nickname= ?`;
  const values = nickname;
  return query(sql, values);
};

exports.join = (id, nickname, password) => {
  const sql = `INSERT INTO user (account, nickname, password, createdAt, updatedAt) VALUES (?,?,?,?,?);`;
  const values = [id, nickname, password, new Date(), new Date()];
  return query(sql, values);
};

exports.login = (id, password) => {
  const sql = `SELECT * FROM user WHERE account = ? AND password = ?;`;
  const values = [id, password];
  return query(sql, values);
};

exports.findpassword = (userId) => {
  const sql = `SELECT password FROM user WHERE account = ?;`;
  const values = userId;
  return new Promise(function (resolve, reject) {
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};
