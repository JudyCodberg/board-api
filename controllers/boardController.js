const boardService = require("../services/boardService");
const func = require("../response.js");

exports.list = async (req, res, next) => {
  try {
    const pageSize = req.query.num; // 한 페이지마다 보여줄 글 개수
    const pageNum = req.query.page; // 현재 페이지 번호(1페이지, 2페이지..), offset
    const target = req.query.target;
    const value = req.query.value;
    if (pageNum <= 0 || pageSize <= 0 || pageNum == undefined || pageSize == undefined) {
      func.response(res, "invalid parameter", 400, null);
    } else {
      const boardCountAll = await boardService.boardCountAll();
      if (boardCountAll - 1 < pageSize) {
        func.response(res, "no data", 400, null);
      } else {
        if (target !== undefined && target.length > 0 && value !== undefined && value.length > 0) {
          if (target == 0) {
            const countNum = await boardService.countSearchTitle(value);
            const searchTitleData = await boardService.searchTitle(pageSize, pageNum, countNum, value);
            if (searchTitleData && countNum) {
              func.response(res, "Success", 200, { searchTitleData, countNum });
            } else {
              func.response(res, "there is no data", 400, countResult);
            }
          } else if (target == 1) {
            const countNum = await boardService.countSearchContent(value);
            const searchContentData = await boardService.searchContent(pageSize, pageNum, countNum, value);
            if (searchContentData && countNum) {
              func.response(res, "Success", 200, { searchTitleData, countNum });
            } else {
              func.response(res, "there is no data", 400, countResult);
            }
          } else if (target == 2) {
            const countNum = await boardService.countSearchAll(value);
            const searchAllData = await boardService.searchAll(pageSize, pageNum, countNum, value);
            if (searchAllData && countNum) {
              func.response(res, "Success", 200, { searchTitleData, countNum });
            } else {
              func.response(res, "there is no data", 400, countResult);
            }
          } else {
            func.response(res, "no search value", 400, null);
          }
        } else {
          if (Math.ceil(boardCountAll / pageSize) >= pageNum) {
            const getList = await boardService.getList(pageSize, pageNum);
            if (getList.length !== 0) {
              func.response(res, "success", 200, { getList });
            } else {
              func.response(res, "no list", 400, null);
            }
          } else {
            func.response(res, "invalid value", 400, null);
          }
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.detail = async (req, res, next) => {
  try {
    let boardId = req.params.id.trim();
    if (boardId == undefined || boardId.length == 0) {
      func.response(res, "invalid value", 400, null);
    } else {
      const result = await boardService.detail(boardId);
      if (result.length === 0) {
        func.response(res, "board_id is not founded", 404, null);
      } else {
        func.response(res, "Success", 200, result);
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.write = async (req, res, next) => {
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
      const result = await boardService.write(title, content, writer);
      if (result.length !== 0) {
        func.response(res, "Success", 200, result);
      } else {
        func.response(res, "write failed", 404, null);
      }
    } else {
      func.response(res, "invalid value", 400, null);
    }
  } catch (err) {
    next(err);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const { title, content, board_id, writer } = req.body;
    if (
      title !== undefined &&
      content !== undefined &&
      board_id !== undefined &&
      writer !== undefined &&
      title.length !== 0 &&
      content.length !== 0 &&
      board_id.length !== 0 &&
      writer.length !== 0
    ) {
      const result = await boardService.edit(title, content, board_id, writer);
      if (result !== 0) {
        func.response(res, "edit complete", 200, null);
      } else {
        func.response(res, "edit failed", 404, null);
      }
    } else {
      func.response(res, "invalid value", 400, null);
    }
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    let boardId = req.params.id.trim();
    if (boardId == undefined || boardId.length == 0) {
      func.response(res, "invalid value", 400, null);
    }
    const findId = await boardService.checkBoardId(boardId);
    if (findId.length !== 0) {
      const result = await boardService.updateDelete(boardId);
      if (result.length !== 0) {
        func.response(res, "Delete successful", 200, null);
      } else {
        func.response(res, "Delete failed", 404, null);
      }
    } else {
      func.response(res, "there is no valid board id", 400, null);
    }
  } catch (err) {
    next(err);
  }
};
