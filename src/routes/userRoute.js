const express = require("express");
const routes = express.Router();
const userController = require("../controllers/userController");

routes.post("/getUserInfo", userController.getUserInfo);
routes.post("/registerUser", userController.register);

module.exports = routes;
