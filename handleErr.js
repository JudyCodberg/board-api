const CustomErr = require("./customErr.js");

exports.handleError = (err, req, res, next) => {
  if (err instanceof CustomErr) {
    res.status(err.status).json({
      message: err.name,
      statusCode: err.status,
    });
  }
};
