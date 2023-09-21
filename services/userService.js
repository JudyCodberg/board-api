const connection = require("../config/config");

exports.checkId = (userId) => {
  const sql = `SELECT * FROM user WHERE account = '${userId}'`;
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result.length);
    });
  });
};

exports.checkName = (nickname) => {
  const sql = `SELECT * FROM user WHERE nickname= '${nickname}'`;
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result.length);
    });
  });
};

exports.join = (id, nickname, password) => {
  const sql = `INSERT INTO user (account, nickname, password, createdAt, updatedAt) VALUES ('${id}', '${nickname}', '${password}', NOW(), NOW());`;
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

exports.login = (id, password) => {
  const sql = `SELECT * FROM user WHERE account = '${id}' AND password = '${password}';`;
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

exports.findpassword = (userId) => {
  const sql = `SELECT password FROM user WHERE account = '${userId}';`;
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(Object.values(JSON.parse(JSON.stringify(result)))[0]);
    });
  });
};
