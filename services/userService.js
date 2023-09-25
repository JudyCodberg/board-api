const bcrypt = require("bcrypt");
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

exports.hashPassword = (password) => {
  return new Promise(function (resolve, reject) {
    resolve(bcrypt.hash(password, 10));
  });
};
exports.join = (id, nickname, hashPw, answer) => {
  const sql = `INSERT INTO user (account, nickname, password, createdAt, updatedAt, pw_answer) VALUES (?,?,?,?,?,?);`;
  const values = [id, nickname, hashPw, new Date(), new Date(), answer];
  return query(sql, values);
};

exports.login = (id) => {
  const sql = `SELECT * FROM user WHERE account = ?;`;
  const values = id;
  return query(sql, values);
};

exports.checkpw = (password, hashedpw) => {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(password, hashedpw, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

exports.findAnswer = (answer) => {
  const sql = `SELECT * FROM user WHERE pw_answer = ?;`;
  const values = answer;
  return query(sql, values);
};

exports.findPassword = (hashPw, account) => {
  const sql = `UPDATE user SET password = ? WHERE account = ? ;`;
  const values = [hashPw, account];
  return query(sql, values);
};
