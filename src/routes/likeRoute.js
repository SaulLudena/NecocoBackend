const express = require("express");
const routes = express.Router();
const likeController = require("../controllers/likeController");

routes.post("/likePost", likeController.likePost);
routes.post("/dislikePost", likeController.dislikePost);
routes.post("/likeByPost", likeController.likeByPost);
module.exports = routes;
