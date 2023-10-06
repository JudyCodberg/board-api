const Response = require("./response");
const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const response = new Response(res);
  const userToken = req.header.token;
  jwt.verify(userToken, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      response.error(err.message, err.expiredAt);
      return reject(false);
    }
    if (decoded.username) {
      response.send("verify success", 200);
      return resolve(true);
    }
    reject(false);
  });
};
