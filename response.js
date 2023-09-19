function response(res, message, code, data) {
  res.status(code).json({
    message: message,
    statusCode: code,
    data: data,
  });
}
module.exports = { response };
