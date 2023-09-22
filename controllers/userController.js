const userService = require("../services/userService");
const Response = require("../response.js");
const CustomErr = require("../customErr");

exports.checkId = async (req, res, next) => {
  const response = new Response(res);
  try {
    const userId = req.params.id.trim();
    if (userId.length == 0 || userId == undefined) {
      response.send("id invalidate", 400, null);
    } else {
      const checkResult = await userService
        .checkId(userId)
        .then((res) => res)
        .catch((err) => err);
      if (checkResult.length !== 0) {
        response.send("Already Exist", 400, null);
      } else {
        response.send("Avaliable Id", 200, null);
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.checkName = async (req, res, next) => {
  const response = new Response(res);
  try {
    const nickname = req.params.name.trim();
    if (nickname.length == 0 || nickname == undefined) {
      response.send("nickname invalidate", 400, null);
    } else {
      const checkResult = await userService
        .checkName(nickname)
        .then((res) => res)
        .catch((err) => err);
      if (checkResult.length !== 0) {
        response.send("Already Exist", 400, null);
      } else {
        response.send("Avaliable Id", 200, null);
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.join = async (req, res, next) => {
  const response = new Response(res);
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
      const checkResult = await userService
        .join(id, nickname, password)
        .then((res) => res)
        .catch((err) => err);
      if (checkResult !== undefined) {
        response.send("Join Success", 200, null);
      } else {
        response.send("Join Failed", 404, null);
      }
    } else {
      response.send("invalid value", 400, null);
    }
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const response = new Response(res);
  try {
    const { id, password } = req.body;
    if (id == undefined || password == undefined || id.length == 0 || password.length == 0) {
      const status = new CustomErr("Parameter is not avaliable", 400);
      next(status);
    } else {
      const result = await userService
        .login(id, password)
        .then((res) => res)
        .catch((err) => err);
      if (result.length == 0) {
        response.send("user info does not exist", 404, null);
      } else {
        response.send("Login Success", 200, null);
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.findpassword = async (req, res) => {
  const response = new Response(res);
  try {
    let userId = req.params.id.trim();
    if (userId == undefined || userId.length == 0) {
      response.send("invalid value", 400, null);
    } else {
      const result = await userService.findpassword(userId);
      if (Object.values(JSON.parse(JSON.stringify(result)))[0] == undefined) {
        response.send("no result", 404, null);
      } else {
        response.send("Password founded", 200, Object.values(JSON.parse(JSON.stringify(result)))[0].password);
      }
    }
  } catch (err) {
    response.send("Unexpected Error", 500, err);
  }
};
