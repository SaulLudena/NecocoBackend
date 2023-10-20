const express = require("express");
const routes = express.Router();
const postController = require("../controllers/postController");

routes.get("/getAllPosts", postController.getAllPosts);
module.exports = routes;
