const userService = require("../services/userService");
const Response = require("../response.js");
const CustomErr = require("../customErr");
const bcrypt = require("bcrypt");

// 아이디 중복체크
exports.checkId = async (req, res, next) => {
  const response = new Response(res);
  try {
    const userId = req.params.id.trim();
    if (userId.length == 0 || userId == undefined) {
      next(new CustomErr("invalid parameter", 400));
    } else {
      const checkResult = await userService
        .checkId(userId)
        .then((res) => res)
        .catch((err) => err);
      if (checkResult.length !== 0) {
        next(new CustomErr("Already Exist", 400));
      } else {
        response.send("Avaliable Id", 200, null);
      }
    }
  } catch (err) {
    next(err);
  }
};

// 닉네임 중복체크
exports.checkName = async (req, res, next) => {
  const response = new Response(res);
  try {
    const nickname = req.params.name.trim();
    if (nickname.length == 0 || nickname == undefined) {
      next(new CustomErr("invalid parameter", 400));
    } else {
      const checkResult = await userService
        .checkName(nickname)
        .then((res) => res)
        .catch((err) => err);
      if (checkResult.length !== 0) {
        next(new CustomErr("Already Exist", 400));
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
    const { id, nickname, password, answer } = req.body;
    if (
      id !== undefined &&
      nickname !== undefined &&
      password !== undefined &&
      answer !== undefined &&
      id.length !== 0 &&
      nickname.length !== 0 &&
      password.length !== 0 &&
      answer.length !== 0
    ) {
      const hashPw = await userService
        .hashPassword(password)
        .then((res) => res)
        .catch((err) => err);
      const checkResult = await userService
        .join(id, nickname, hashPw, answer)
        .then((res) => res)
        .catch((err) => err);
      if (checkResult !== undefined) {
        response.send("Join Success", 200, null);
      } else {
        next(new CustomErr("Join Failed", 404));
      }
    } else {
      next(new CustomErr("invalid value", 400));
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
      next(new CustomErr("Parameter is not avaliable", 400));
    } else {
      const result = await userService
        .login(id)
        .then((res) => res)
        .catch((err) => err);
      if (result.length == 0) {
        next(new CustomErr("user info does not exist", 404));
      } else {
        const hashedpw = Object.values(JSON.parse(JSON.stringify(result)))[0].password;
        const syncPw = await userService
          .checkpw(password, hashedpw)
          .then((res) => res)
          .catch((err) => err);
        if (syncPw) {
          response.send("Login Success", 200, null);
        } else {
          next(new CustomErr("password not matched", 400));
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

// 비밀번호 답변 체크
exports.checkAnswer = async (req, res, next) => {
  const response = new Response(res);
  try {
    const { answer } = req.body;
    if (answer == undefined || answer.length == 0) {
      next(new CustomErr("invalid value", 400));
    } else {
      const result = await userService
        .findAnswer(answer)
        .then((res) => res)
        .catch((err) => err);
      if (result.length == 0) {
        next(new CustomErr("no result", 404));
      } else {
        response.send("Password founded", 200, result);
      }
    }
  } catch (err) {
    next(err);
  }
};

// 비밀번호 재설정
exports.newPassword = async (req, res, next) => {
  const response = new Response(res);
  try {
    const { new_password, account } = req.body;
    const hashPw = await bcrypt.hash(new_password, 10);
    if (hashPw == undefined || hashPw.length == 0 || account == undefined || account.length == 0) {
      next(new CustomErr("invalid value", 400));
    } else {
      const checkResult = await userService
        .checkId(account)
        .then((res) => res)
        .catch((err) => err);
      if (checkResult.length !== 0) {
        const result = await userService
          .findPassword(hashPw, account)
          .then((res) => res)
          .catch((err) => err);
        if (result.length == 0) {
          next(new CustomErr("no result", 404));
        } else {
          response.send("New Password is confirmed", 200, result);
        }
      } else {
        next(new CustomErr("no validate account", 400));
      }
    }
  } catch (err) {
    next(err);
  }
};
