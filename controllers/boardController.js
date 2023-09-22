const boardService = require("../services/boardService");
const Response = require("../response.js");
const CustomErr = require("../customErr");

exports.list = async (req, res, next) => {
  const response = new Response(res);
  try {
    const pageSize = Number(req.query.num); // 한 페이지마다 보여줄 글 개수
    const pageNum = Number(req.query.page); // 현재 페이지 번호(1페이지, 2페이지..), offset
    const target = Number(req.query.target);
    const value = req.query.value;

    if (pageNum <= 0 || pageSize <= 0 || pageNum == undefined || pageSize == undefined) {
      response.error("invalid parameter", 400, null);
    } else {
      const boardCountAll = await boardService.boardCountAll();
      if (boardCountAll - 1 < pageSize) {
        response.error("no data", 400, null);
      } else {
        if (target !== undefined && value !== undefined) {
          if (target == 0) {
            const countNum = await boardService
              .countSearchTitle(value)
              .then((res) => Object.values(JSON.parse(JSON.stringify(res)))[0].count)
              .catch((err) => err);
            if (countNum == 0) {
              response.error("there is no data", 400, null);
            } else {
              const searchTitleData = await boardService
                .searchTitle(pageSize, pageNum, value)
                .then((res) => res)
                .catch((err) => err);
              response.send("Success", 200, { searchTitleData, countNum });
            }
          } else if (target == 1) {
            const countNum = await boardService
              .countSearchContent(value)
              .then((res) => Object.values(JSON.parse(JSON.stringify(res)))[0].count)
              .catch((err) => err);
            if (countNum == 0) {
              response.error("there is no data", 400, null);
            } else {
              const searchContentData = await boardService
                .searchContent(pageSize, pageNum, value)
                .then((res) => res)
                .catch((err) => err);
              response.send("Success", 200, { searchContentData, countNum });
            }
          } else if (target == 2) {
            const countNum = await boardService
              .countSearchAll(value)
              .then((res) => Object.values(JSON.parse(JSON.stringify(res)))[0].count)
              .catch((err) => err);
            if (countNum == 0) {
              response.error("there is no data", 400, null);
            } else {
              const searchAllData = await boardService
                .searchAll(pageSize, pageNum, value)
                .then((res) => res)
                .catch((err) => err);
              response.send("Success", 200, { searchAllData, countNum });
            }
          } else {
            response.error("no search value", 400, null);
          }
        } else {
          if (Math.ceil(boardCountAll / pageSize) >= pageNum) {
            const getList = await boardService
              .getList(pageSize, pageNum)
              .then((res) => res)
              .catch((err) => err);
            if (getList.length !== 0 && getList !== undefined) {
              response.send("success", 200, getList);
            } else {
              response.error("no list", 400, null);
            }
          } else {
            response.error("invalid value", 400, null);
          }
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.detail = async (req, res, next) => {
  const response = new Response(res);
  try {
    let boardId = req.params.id.trim();
    if (boardId == undefined || boardId.length == 0) {
      response.error("invalid value", 400, null);
    } else {
      const result = await boardService
        .detail(boardId)
        .then((res) => Object.values(JSON.parse(JSON.stringify(res))))
        .catch((err) => err);
      if (result.length === 0) {
        response.error("board_id is not founded", 404, null);
      } else {
        response.send("Success", 200, result);
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.write = async (req, res, next) => {
  const response = new Response(res);
  try {
    const { title, content, writer } = req.body;
    if (
      title !== undefined &&
      content !== undefined &&
      writer !== undefined &&
      title.length !== 0 &&
      content.length !== 0 &&
      writer.length !== 0
    ) {
      const result = await boardService
        .write(title, content, writer)
        .then((res) => res)
        .catch((err) => err);
      if (result.length !== 0) {
        response.send("Success", 200, result);
      } else {
        response.error("write failed", 404, null);
      }
    } else {
      response.error("invalid value", 400, null);
    }
  } catch (err) {
    next(err);
  }
};

exports.edit = async (req, res, next) => {
  const response = new Response(res);
  try {
    const { title, content, board_id, writer } = req.body;
    if (
      title !== undefined &&
      content !== undefined &&
      board_id !== undefined &&
      title.length !== 0 &&
      content.length !== 0 &&
      board_id.length !== 0
    ) {
      const boardIndex = Number(board_id);
      const result = await boardService
        .edit(title, content, boardIndex)
        .then((res) => res)
        .catch((err) => err);
      if (result !== 0) {
        response.send("edit complete", 200, null);
      } else {
        response.error("edit failed", 404, null);
      }
    } else {
      response.error("invalid value", 400, null);
    }
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const response = new Response(res);
  try {
    let boardId = req.params.id.trim();
    if (boardId == undefined || boardId.length == 0) {
      response.error("invalid value", 400, null);
    }
    const findId = await boardService
      .checkBoardId(boardId)
      .then((res) => res)
      .catch((err) => err);
    const checkState = Object.values(JSON.parse(JSON.stringify(findId)))[0].is_delete;
    if (checkState == 1) {
      const result = await boardService
        .updateDelete(boardId)
        .then((res) => res)
        .catch((err) => err);
      if (result.length !== 0) {
        response.send("Delete successful", 200, null);
      } else {
        response.error("Delete failed", 404, null);
      }
    } else {
      response.error("there is no valid board id", 400, null);
    }
  } catch (err) {
    next(err);
  }
};
