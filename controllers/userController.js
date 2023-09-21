const userService = require("../services/userService");
const func = require("../response.js");

exports.checkId = async (req, res, next) => {
  try {
    const userId = req.params.id.trim();
    if (userId.length == 0 || userId == undefined) {
      func.response(res, "id invalidate", 400, null);
    } else {
      const checkResult = await userService.checkId(userId);
      if (checkResult !== 0) {
        func.response(res, "Already Exist", 200, null);
      } else {
        func.response(res, "Avaliable Id", 200, null);
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.checkName = async (req, res, next) => {
  try {
    const nickname = req.params.name.trim();
    if (nickname.length == 0 || nickname == undefined) {
      func.response(res, "nickname invalidate", 400, null);
    } else {
      const checkResult = await userService.checkName(nickname);
      if (checkResult !== 0) {
        func.response(res, "Already Exist", 200, null);
      } else {
        func.response(res, "Avaliable nickname", 200, null);
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.join = async (req, res, next) => {
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
      const checkResult = await userService.join(id, nickname, password);
      if (checkResult !== undefined) {
        func.response(res, "Join Success", 200, null);
      } else {
        func.response(res, "Join Failed", 404, null);
      }
    } else {
      func.response(res, "invalid value", 400, null);
    }
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { id, password } = req.body;
    if (id == undefined || password == undefined || id.length == 0 || password.length == 0) {
      const status = new CustomErr("err", 400);
      next(status);
    } else {
      const result = await userService.login(id, password);
      if (result.length == 0) {
        func.response(res, "user info does not exist", 404, null);
      } else {
        func.response(res, "Login Success", 200, null);
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.findpassword = async (req, res) => {
  try {
    let userId = req.params.id.trim();
    if (userId == undefined || userId.length == 0) {
      func.response(res, "invalid value", 400, null);
    } else {
      const result = await userService.findpassword(userId);
      if (result == undefined) {
        func.response(res, "no result", 404, null);
      } else {
        func.response(res, "Password founded", 200, result.password);
      }
    }
  } catch (err) {
    func.response(res, "Unexpected Error", 500, err);
  }
};
