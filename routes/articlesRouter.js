const articlesRouter = require("express").Router();
const express = require("express");
const {
  sendArticles,
  patchArticle,
  getArticlesById
} = require("../controllers/articlesController.js");

const { send405Error } = require("../errorHandlers");

const {
  postComment,
  getComment
} = require("../controllers/commentsController");

articlesRouter.route("/").get(sendArticles);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getComment)
  .all(send405Error);

articlesRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(patchArticle)
  .all(send405Error);

module.exports = articlesRouter;
