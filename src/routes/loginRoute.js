const express = require("express");
const routes = express.Router();
const tokenValidationController = require("../controllers/tokenValidationController");

routes.post("/loginUser", tokenValidationController.login);
routes.get("/protectedRoute", tokenValidationController.protectedRoute);
module.exports = routes;
