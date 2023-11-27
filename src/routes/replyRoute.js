const express = require("express");
const routes = express.Router();
const replyController = require("../controllers/replyController");

routes.post("/getReplyByPost", replyController.getReplyByPost);
routes.post("/replyPost", replyController.replyPost);
routes.post("/deleteReply", replyController.deleteReply);
routes.post("/editReply", replyController.editReply);
module.exports = routes;
