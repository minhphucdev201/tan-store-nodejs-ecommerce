const express = require("express");
const router = express.Router();
const middlewares = require("../app/middleware/authentication");

const commentController = require("../app/controllers/comment.controller");

router.delete(
  "/del/:id",
  //   middlewares.checkAuthencation,
  //   middlewares.checkRoleDelCata,
  commentController.delete
);
router.put(
  "/edit",
  //  middlewares.checkAuthencation,
  commentController.update
);
router.post("/create", middlewares.checkAuthencation, commentController.create);
router.get("/:id", commentController.getByIdCata);
router.get("/idProduct/:id", commentController.GetAllByIdProduct);
router.get("/", commentController.getAll);

module.exports = router;
