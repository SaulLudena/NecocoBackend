const express = require("express");
const routes = express.Router();
const postController = require("../controllers/postController");

routes.post("/getAllPosts", postController.getAllPosts);

routes.post("/deletePost", postController.deletePost);
routes.post("/createPost", postController.createPost);
routes.post("/editPost", postController.editPost);
module.exports = routes;
