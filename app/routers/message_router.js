const { Router } = require("express");
const {
  sendMessage,
  sendBulkMessage,
  sendPdf,
  sendImg,
} = require("../controllers/message_controller");
const MessageRouter = Router();

MessageRouter.all("/send-message", sendMessage);
MessageRouter.all("/send-bulk-message", sendBulkMessage);
MessageRouter.all("/send-pdf", sendPdf);
MessageRouter.all("/send-images", sendImg);

module.exports = MessageRouter;
