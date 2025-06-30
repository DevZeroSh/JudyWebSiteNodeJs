const express = require("express");

const authService = require("../services/AuthService");
const {
  createBoardMember,
  deleteBoardMember,
  getBoardMember,
  getOneBoardMember,
  updateBoardMember,
  resizeBoardMemberImages,
  uploadBoardMemberImage,
} = require(".././services/boardMemberService");

const boardMemberRouter = express.Router();

boardMemberRouter
  .route("/")
  .get(getBoardMember)
  .post(
    authService.protect,
    uploadBoardMemberImage,
    resizeBoardMemberImages,
    createBoardMember
  );
boardMemberRouter
  .route("/:id")
  .get(getOneBoardMember)
  .put(
    authService.protect,
    uploadBoardMemberImage,
    resizeBoardMemberImages,
    updateBoardMember
  )
  .delete(authService.protect, deleteBoardMember);
module.exports = boardMemberRouter;
