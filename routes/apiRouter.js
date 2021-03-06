const apiRouter = require("express").Router();

const topicsRouter = require("./topicsRouter.js");
const userRouter = require("./userRouter.js");
const articlesRouter = require("./articlesRouter.js");
const commentRouter = require("./commentsRouter");

const endpoints = require("../endpoints.json");

//--------------------

//---
apiRouter.route("/").get((req, res, next) => {
  res.send(endpoints);
});

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/users", userRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentRouter);

apiRouter
  .route("")
  .get((req, res, next) =>
    res.status(200).send({ msg: "Welcome to NewsApp!" })
  );

apiRouter
  .route("/*")
  .get((req, res, next) => res.status(404).send({ msg: "route not found" }));

apiRouter
  .route("/*")
  .all((req, res, next) => res.status(404).send({ msg: "route not found" }));

//-----

module.exports = apiRouter;
